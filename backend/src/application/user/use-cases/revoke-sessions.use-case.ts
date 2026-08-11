import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { TokenRevocationRegistry } from '../../../infrastructure/cache/token-revocation-registry';
import { NotFoundError, DomainError } from '../../../domain/errors/domain.error';

export interface RevokeUserSessionsInput {
  userId: string;
  adminId: string;
}

@injectable()
export class RevokeUserSessionsUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TOKENS.AuditLogRepository) private readonly auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.TokenRevocationRegistry) private readonly revocationRegistry: TokenRevocationRegistry
  ) {}

  async execute(input: RevokeUserSessionsInput): Promise<void> {
    if (input.userId === input.adminId) {
      throw new DomainError('You cannot revoke your own sessions');
    }

    const user = await this.userRepo.findById(input.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newVersion = user.tokenVersion + 1;
    await this.userRepo.update(input.userId, { tokenVersion: newVersion });
    this.revocationRegistry.revoke(input.userId, newVersion);

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'REVOKE_SESSIONS',
      targetType: 'User',
      targetId: input.userId,
    });
  }
}