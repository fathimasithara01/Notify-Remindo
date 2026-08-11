import crypto from 'crypto';
import { injectable, inject } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { IOrganizationSubscriptionRepository }
  from "../../../domain/repositories/organization-subscription.repository.interface";
import { IHashService } from '../../../domain/services/hash.service.interface';

import { INotifierService } from '../../../domain/services/notifier.service.interface';

import { Organization } from '../../../domain/entities/organization.entity';
import { User } from '../../../domain/entities/platformUser.entity';
import { DomainError } from '../../../domain/errors/domain.error';

import { CreateOrganizationDto } from '../../dtos/organization/create-organization.dto';

import { inviteEmailTemplate } from '../../../infrastructure/email-templates/invite-email.template';
import { generateTempPassword } from '../../../shared/utils/password-generator';
import { env } from '../../../config/env';

const INVITE_TOKEN_TTL_HOURS = 24;

export interface CreateOrganizationInput {
  data: CreateOrganizationDto;
  adminId: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  admin: User;
  /** Present only when inviteMethod === 'email'. */
  inviteUrl?: string;
  /** Present only when inviteMethod === 'email'. False if the email send failed. */
  emailSent?: boolean;
  /** Present only when inviteMethod === 'temp-password'. Plain text — this is
   * the ONLY time it's ever available outside the hash. Never logged, never
   * stored anywhere but the response. */
  tempPassword?: string;
}

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private emailNotifier: INotifierService,
    @inject(TOKENS.HashService) private hashService: IHashService,
    @inject(TOKENS.SubscriptionPlanRepository) private readonly organizationSubscriptionRepository: IOrganizationSubscriptionRepository,
  ) { }

  async execute(input: CreateOrganizationInput): Promise<CreateOrganizationResult> {
    const { data, adminId } = input;

    // 1. Validate subscription plan if provided
    const plan = data.planId ? await this.planRepo.findById(data.planId) : null;
    if (data.planId && (!plan || plan.status != 'active')) {
      throw new DomainError('Selected subscription plan is not available');
    }

    // 2. Check whether Admin login email already exists
    const existingUser = await this.userRepo.findByEmail(data.admin.email);
    if (existingUser) {
      throw new DomainError(`An account already exists for ${data.admin.email}.`);
    }

    // 3. Find Organization Admin role
    const organizationAdminRole = await this.roleRepo.findByName('orgadmin');
    if (!organizationAdminRole) {
      throw new DomainError('Organization Admin role is not configured.');
    }

    // 4. Create Organization
    const organization = await this.orgRepo.create({
      name: data.name,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      address: data.address,
      currentPlanId: data.planId || null,
      salesmanId: data.salesmanId || null,
      documents: data.documents,
    });

    // 5. Create Subscription if plan exists
    if (plan) {
      const startDate = new Date();
      const endDate = new Date(startDate);

      switch (plan.billingInterval) {
        case "weekly":
          endDate.setDate(endDate.getDate() + 7);
          break;
        case "monthly":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "yearly":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      await this.organizationSubscriptionRepository.create({
        organizationId: organization.id,
        planId: plan.id,
        startDate,
        endDate,
        nextBillingDate: endDate,
        priceInMinorUnit: plan.priceInMinorUnit,
        currency: plan.currency,
        billingInterval: plan.billingInterval,
        paymentProvider: undefined,
        paymentTransactionId: undefined,
        autoRenew: false,
        status: "active",
      });
    }

    // 6. Create Organization Admin User — branches based on inviteMethod
    const result =
      data.inviteMethod === 'temp-password'
        ? await this.createAdminWithTempPassword(data, organization.id)
        : await this.createAdminWithInviteEmail(data, organization.id);

    // 7. Assign Organization Admin Role
    await this.userRepo.assignRole(result.admin.id, organizationAdminRole.id);

    // 8. Audit log
    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_ORGANIZATION',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: {
        name: organization.name,
        planId: plan?.id ?? null,
        adminUserId: result.admin.id,
        inviteMethod: data.inviteMethod,
      },
    });

    return { organization, ...result };
  }

  /** Email-invite path: user stays 'invited' until they click the link and
   * set their own password. Email delivery is best-effort — failure here
   * never rolls back the organization/user records already created. */
  private async createAdminWithInviteEmail(data: CreateOrganizationDto, organizationId: string): Promise<{ admin: User; inviteUrl: string; emailSent: boolean }> {

    const orgAdminRole = await this.roleRepo.findByName('Org Admin');
    if (!orgAdminRole) {
      throw new DomainError('Org Admin role not found — ensure roles are seeded');
    }

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    const admin = await this.userRepo.create({
      name: data.admin.name,
      email: data.admin.email,
      phone: data.admin.phone ?? null,
      passwordHash: null,
      status: 'invited',
      organizationId,
      inviteToken,
      inviteTokenExpiresAt,
      tokenVersion: 0,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
      role: orgAdminRole.id,
      mustChangePassword: false,
    });

    const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    let emailSent = true;
    try {
      const content = inviteEmailTemplate({
        orgName: data.name,
        inviteUrl,
        ttlHours: INVITE_TOKEN_TTL_HOURS,
      });
      await this.emailNotifier.send({
        to: data.admin.email,
        subject: content.subject,
        message: content.text,
        html: content.html,
      });
    } catch (error) {
      emailSent = false;
      console.error(`Failed to send org-invite email to ${data.admin.email}:`, error);
    }

    return { admin, inviteUrl, emailSent };
  }

  /** Temp-password path: no email is sent at all. The admin creating the
   * org copies the password from the response and shares it out of band.
   * User starts 'active' but must change the password on first login. */
  private async createAdminWithTempPassword(data: CreateOrganizationDto, organizationId: string): Promise<{ admin: User; tempPassword: string }> {
    const orgAdminRole = await this.roleRepo.findByName('Org Admin');
    if (!orgAdminRole) {
      throw new DomainError('Org Admin role not found — ensure roles are seeded');
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await this.hashService.hash(tempPassword);

    const admin = await this.userRepo.create({
      name: data.admin.name,
      email: data.admin.email,
      phone: data.admin.phone ?? null,
      passwordHash,
      status: 'active',
      organizationId,
      inviteToken: null,
      inviteTokenExpiresAt: null,
      tokenVersion: 0,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
      role: orgAdminRole.id,
      mustChangePassword: true,
    });

    return { admin, tempPassword };
  }
}