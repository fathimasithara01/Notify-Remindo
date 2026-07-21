import crypto from 'crypto';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';
import { env } from '../../../config/env';

const INVITE_TOKEN_TTL_HOURS = 24;

@injectable()
export class ResendInviteUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.EmailNotifierService) private emailNotifier: INotifierService
  ) {}

  async execute(organizationId: string): Promise<void> {
    const organization = await this.orgRepo.findById(organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const orgUsers = await this.userRepo.list({ organizationId });
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
    await this.emailNotifier.send({
      to: orgAdminUser.email,
      subject: `Reminder: set up your Notify account for ${organization.name}`,
      message: `Set your password to get started: ${inviteUrl} (link expires in ${INVITE_TOKEN_TTL_HOURS} hours).`,
    });
  }
}