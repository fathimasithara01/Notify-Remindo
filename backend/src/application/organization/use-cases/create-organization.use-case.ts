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
  ) {}

  async execute(input: CreateOrganizationInput): Promise<Organization> {
    const { data, adminId } = input;

    const plan = await this.planRepo.findById(data.planId);
    if (!plan || plan.status !== 'active') {
      throw new DomainError('Selected subscription plan is not available');
    }

    const existingUser = await this.userRepo.findByEmail(data.contactEmail);
    if (existingUser) {
      throw new DomainError(
        `An account already exists for ${data.contactEmail}. Use a different contact email.`
      );
    }

    const orgAdminRole = await this.roleRepo.findBySlug('orgadmin');
    if (!orgAdminRole) {
      throw new DomainError(
        'Org Admin role is not configured. Run the seed script before creating organizations.'
      );
    }

    const organization = await this.orgRepo.create({
      name: data.name,
      businessDetails: data.businessDetails,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      currentPlanId: data.planId,
      salesmanId: data.salesmanId ?? null,
    });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await this.planRepo.createSubscriptionRecord({
      organizationId: organization.id,
      planId: plan.id,
      startDate,
      endDate,
      status: 'active',
    });

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    const orgAdminUser = await this.userRepo.create({
      name: `${data.name} Admin`,
      email: data.contactEmail,
      passwordHash: null,
      status: 'invited',
      organizationId: organization.id,
      inviteToken,
      inviteTokenExpiresAt,
      tokenVersion: 0,
    });

    await this.userRepo.assignRole(orgAdminUser.id, orgAdminRole.id);

    await this.sendInviteEmail(data.contactEmail, data.name, inviteToken);

    await this.auditLogRepo.create({
      adminId,
      action: 'CREATE_ORGANIZATION',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: { name: organization.name, planId: plan.id },
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
      console.error('Failed to send invite email:', error);
    }
  }
}