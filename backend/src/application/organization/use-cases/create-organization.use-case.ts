import crypto from 'crypto';
import { injectable, inject } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { IOrganizationSubscriptionRepository } from '../../../domain/repositories/organization-subscription.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';

import { Organization } from '../../../domain/entities/organization.entity';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { DomainError } from '../../../domain/errors/domain.error';

import { CreateOrganizationDto } from '../../dtos/organization/create-organization.dto';

import { inviteEmailTemplate } from '../../../infrastructure/email-templates/invite-email.template';
import { generateTempPassword } from '../../../shared/utils/password-generator';
import { env } from '../../../config/env';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

const INVITE_TOKEN_TTL_HOURS = 24;
const ORG_ADMIN_ROLE_NAME = 'Org Admin';

export interface CreateOrganizationInput {
  data: CreateOrganizationDto;
  adminId: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  admin: User;
  inviteUrl?: string;
  emailSent?: boolean;
  tempPassword?: string;
}

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private platformRoleRepo: IPlatformRoleRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private emailNotifier: INotifierService,
    @inject(TOKENS.HashService) private hashService: IHashService,
  ) { }

  async execute(input: CreateOrganizationInput): Promise<CreateOrganizationResult> {
    const { data, adminId } = input;

    const plan = data.planId ? await this.planRepo.findById(data.planId) : null;
    if (data.planId && (!plan || plan.status !== 'active')) {
      throw new DomainError('Selected subscription plan is not available');
    }

    const orgAdminRole = await this.platformRoleRepo.findByName(ORG_ADMIN_ROLE_NAME);
    if (!orgAdminRole) {
      throw new DomainError('Org Admin role not found — ensure roles are seeded');
    }

    const organization = await this.orgRepo.create({
      name: data.name,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      address: data.address,
      currentPlanId: data.planId || null,
      salesmanId: data.salesmanId || null,
      documents: data.documents,
    });

    // if (plan) {
    //   const startDate = new Date();
    //   const endDate = new Date(startDate);

    //   switch (plan.billingInterval) {
    //     case 'weekly':
    //       endDate.setDate(endDate.getDate() + 7);
    //       break;
    //     case 'monthly':
    //       endDate.setMonth(endDate.getMonth() + 1);
    //       break;
    //     case 'yearly':
    //       endDate.setFullYear(endDate.getFullYear() + 1);
    //       break;
    //   }

    //   await this.organizationSubscriptionRepository.create({
    //     organizationId: organization.id,
    //     planId: plan.id,
    //     startDate,
    //     endDate,
    //     nextBillingDate: endDate,
    //     priceInMinorUnit: plan.priceInMinorUnit,
    //     currency: plan.currency,
    //     billingInterval: plan.billingInterval,
    //     autoRenew: false,
    //     status: 'active',
    //   });
    // }

    const result = data.inviteMethod === 'temppassword'
      ? await this.createAdminWithTempPassword(data, organization.id, orgAdminRole)
      : await this.createAdminWithInviteEmail(data, organization.id, orgAdminRole);

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

  private async createAdminWithInviteEmail( data: CreateOrganizationDto, organizationId: string, orgAdminRole: Role): Promise<{ admin: User; inviteUrl: string; emailSent: boolean }> {
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    const admin = await this.userRepo.create({
      firstName: data.admin.firstName,
      lastName: data.admin.lastName,
      email: data.admin.email,
      passwordHash: null,
      status: 'invited',
      organizationId,
      inviteToken,
      inviteTokenExpiresAt,
      roleId: orgAdminRole.id,
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

  private async createAdminWithTempPassword(
    data: CreateOrganizationDto,
    organizationId: string,
    orgAdminRole: Role
  ): Promise<{ admin: User; tempPassword: string }> {
    const tempPassword = generateTempPassword();
    const passwordHash = await this.hashService.hash(tempPassword);

    const admin = await this.userRepo.create({
      firstName: data.admin.firstName,
      lastName: data.admin.lastName,
      email: data.admin.email,
      passwordHash,
      status: 'active',
      organizationId,
      roleId: orgAdminRole.id,
      mustChangePassword: true,
    });

    return { admin, tempPassword };
  }
}