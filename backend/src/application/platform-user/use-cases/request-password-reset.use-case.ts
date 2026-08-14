import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';

import {
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../../domain/errors/domain.error';

interface RequestPasswordResetInput {
  userId: string;
  password: string;
  adminId: string;
}

@injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private readonly platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.AuditLogRepository) private readonly auditLogRepo: IAuditLogRepository,
  ) { }

  async execute(input: RequestPasswordResetInput): Promise<void> {

    if (!input.password || typeof input.password !== 'string') {
      throw new ValidationError('Password is required');
    }

    // 1. Validate password policy first — fail fast before any DB round-trip
    this.validatePassword(input.password);

    // 2. Verify user exists
    const user = await this.platformUserRepo.findById(input.userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 3. Only active users can have a password reset issued
    if (user.status !== 'active') {
      throw new DomainError('Password reset can only be issued for active users.');
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(input.password, 12);

    // 5. Update password
    const updated = await this.platformUserRepo.update(user.id, {
      passwordHash,
    });

    if (!updated) {
      throw new Error('Unable to reset password');
    }

    // 6. Create audit trail
    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'REQUEST_PASSWORD_RESET',
      targetType: 'User',
      targetId: user.id,
      metadata: {
        email: user.email,
      },
    });
  }

  private validatePassword(password: string): void {
    const rules = [
      {
        valid: password.length >= 8,
        message: 'Password must contain minimum 8 characters',
      },
      {
        valid: /[A-Z]/.test(password),
        message: 'Password must contain uppercase letter',
      },
      {
        valid: /[a-z]/.test(password),
        message: 'Password must contain lowercase letter',
      },
      {
        valid: /[0-9]/.test(password),
        message: 'Password must contain number',
      },
      {
        valid: /[^A-Za-z0-9]/.test(password),
        message: 'Password must contain special character',
      },
    ];

    const failedRule = rules.find((rule) => !rule.valid);

    if (failedRule) {
      throw new ValidationError(failedRule.message);
    }
  }
}