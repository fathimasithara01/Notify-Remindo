import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
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
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TokenRevocationRegistry) private revocationRegistry: TokenRevocationRegistry
  ) {}

  async execute(input: RevokeSessionsInput): Promise<void> {
    const user = await this.platformUserRepo.findById(input.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newVersion = user.tokenVersion + 1;
    await this.platformUserRepo.update(input.userId, { tokenVersion: newVersion });
    this.revocationRegistry.revoke(input.userId, newVersion);

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'REVOKE_SESSIONS',
      targetType: 'PlatformUser',
      targetId: input.userId,
    });
  }
}