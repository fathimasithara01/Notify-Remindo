import crypto from 'crypto';
import { injectable, inject } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';

import { INotifierService } from '../../../domain/services/notifier.service.interface';

import { Organization } from '../../../domain/entities/organization.entity';
import { DomainError } from '../../../domain/errors/domain.error';

import { CreateOrganizationDto } from '../../dtos/create-organization.dto';

import { inviteEmailTemplate } from '../../../infrastructure/email-templates/invite-email.template';
import { env } from '../../../config/env';

const INVITE_TOKEN_TTL_HOURS = 24;

export interface CreateOrganizationInput {
  data: CreateOrganizationDto;
  adminId: string;
}

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,

    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,

    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,

    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,

    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,

    @inject(TOKENS.EmailNotifierService) private emailNotifier: INotifierService
  ) { }

  async execute(input: CreateOrganizationInput): Promise<Organization> {
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
    const organizationAdminRole = await this.roleRepo.findBySlug('orgadmin');
    if (!organizationAdminRole) {
      throw new DomainError('Organization Admin role is not configured.');
    }

    // 4. Create Organization
    const organization = await this.orgRepo.create({
      name: data.name,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      address: data.address,
      currentPlanId: data.planId ?? null,
      salesmanId: data.salesmanId ?? null,
      documents: data.documents,
    });

    // 6. Create Subscription if plan exists
    if (plan) {
      const startDate = new Date();

      const endDate = new Date(startDate);

      endDate.setDate(
        endDate.getDate() + plan.durationDays
      );

      await this.planRepo.createSubscriptionRecord({
        organizationId: organization.id,
        planId: plan.id,
        startDate,
        endDate,
        status: 'active',
      });
    }

    // 7. Generate invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    // 8. Create Organization Admin User
    const organizationAdminUser = await this.userRepo.create({
      name: data.admin.name,
      email: data.admin.email,
      phone: data.admin.phone ?? null,
      passwordHash: null,
      status: 'invited',
      organizationId: organization.id,
      inviteToken,
      inviteTokenExpiresAt,
      tokenVersion: 0,
    });

    // 9. Assign Organization Admin Role
    await this.userRepo.assignRole(organizationAdminUser.id, organizationAdminRole.id);

    // 10. Send invitation to Admin login email
    await this.sendInviteEmail(data.admin.email, data.name, inviteToken);

    // 11. Audit log
    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_ORGANIZATION',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: {
        name: organization.name,
        planId: plan?.id ?? null,
        adminUserId: organizationAdminUser.id,
      },
    });

    return organization;
  }

  private async sendInviteEmail(email: string, orgName: string, token: string): Promise<void> {
    const inviteUrl = `${env.FRONTEND_URL}/accept-invite/${token}`;

    const content = inviteEmailTemplate({
      orgName,
      inviteUrl,
      ttlHours: INVITE_TOKEN_TTL_HOURS,
    });

    try {
      await this.emailNotifier.send({
        to: email,
        subject: content.subject,
        message: content.text,
        html: content.html,
      });
    } catch (error) {
      console.error(
        'Failed to send invite email:',
        error
      );
    }
  }
}