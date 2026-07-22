import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';

@injectable()
export class RevokeSessionsUseCase {
  constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepo.update(userId, { tokenVersion: user.tokenVersion + 1 });
  }
}