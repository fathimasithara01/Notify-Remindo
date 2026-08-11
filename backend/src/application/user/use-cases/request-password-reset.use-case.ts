import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';
import { generateInviteToken, getInviteExpiry } from '../../../shared/utils/token-generator';
import { env } from '../../../config/env';

export interface RequestPasswordResetResult {
  resetUrl: string;
  emailSent: boolean;
}

@injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.EmailNotifierService) private notifierService: INotifierService
  ) {}

  async execute(userId: string, adminId: string): Promise<RequestPasswordResetResult> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.status !== 'active') {
      throw new DomainError('Password reset links can only be sent to active users.');
    }

    const resetPasswordToken = generateInviteToken();
    // Shorter window than an invite (24h vs 7d) — a reset link is more
    // sensitive since it can take over an already-active account.
    const resetPasswordTokenExpiresAt = getInviteExpiry(1);

    await this.userRepo.update(user.id, { resetPasswordToken, resetPasswordTokenExpiresAt });

    await this.auditLogRepo.create({
      adminId,
      action: 'REQUEST_PASSWORD_RESET',
      targetType: 'User',
      targetId: user.id,
      metadata: { email: user.email },
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;

    let emailSent = true;
    try {
      await this.notifierService.send({
        to: user.email,
        subject: 'Reset your Notify password',
        message: `Hi ${user.firstName}, click this link to set a new password: ${resetUrl}`,
        html: `<p>Hi ${user.lastName},</p><p>Click below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 24 hours. If you didn't request this, you can ignore it.</p>`,
      });
    } catch (error) {
      emailSent = false;
      console.error(`Failed to send password reset email to ${user.email}:`, error);
    }

    return { resetUrl, emailSent };
  }
}