import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { TokenRevocationRegistry } from '../../../infrastructure/cache/token-revocation-registry';
import { NotFoundError } from '../../../domain/errors/domain.error';

@injectable()
export class RevokeSessionsUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.TokenRevocationRegistry) private revocationRegistry: TokenRevocationRegistry
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newVersion = user.tokenVersion + 1;
    await this.userRepo.update(userId, { tokenVersion: newVersion });

    this.revocationRegistry.revoke(userId, newVersion);
  }
}