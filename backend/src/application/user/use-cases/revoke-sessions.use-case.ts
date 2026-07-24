import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { TokenRevocationRegistry } from '../../../infrastructure/cache/token-revocation-registry';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface RevokeSessionsInput {
  userId: string;
  adminId: string;
}

@injectable()
export class RevokeSessionsUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.TokenRevocationRegistry) private revocationRegistry: TokenRevocationRegistry,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: RevokeSessionsInput): Promise<void> {
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