import crypto from 'crypto';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';
import { inviteEmailTemplate } from '../../../infrastructure/email-templates/invite-email.template';
import { env } from '../../../config/env';

const INVITE_TOKEN_TTL_HOURS = 24;

export interface ResendInviteInput {
  organizationId: string;
  adminId: string;
}

@injectable()
export class ResendInviteUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private emailNotifier: INotifierService
  ) {}

  async execute(input: ResendInviteInput): Promise<void> {
    const organization = await this.orgRepo.findById(input.organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const orgUsers = await this.userRepo.list({ organizationId: input.organizationId });
    const orgAdminUser = orgUsers.find((u) => u.status === 'invited');

    if (!orgAdminUser) {
      throw new DomainError(
        'No pending invite found for this organization — the admin account may already be active.'
      );
    }

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await this.userRepo.update(orgAdminUser.id, { inviteToken, inviteTokenExpiresAt });

    const inviteUrl = `${env.FRONTEND_URL}/accept-invite/${inviteToken}`;
    const content = inviteEmailTemplate({
      orgName: organization.name,
      inviteUrl,
      ttlHours: INVITE_TOKEN_TTL_HOURS,
      isResend: true,
    });

    await this.emailNotifier.send({
      to: orgAdminUser.email,
      subject: content.subject,
      message: content.text,
      html: content.html,
    });

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'RESEND_INVITE',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: { userEmail: orgAdminUser.email },
    });
  }
}