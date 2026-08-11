import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface CurrentUserResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(@inject(TOKENS.UserRepository) private readonly userRepo: IUserRepository) {}

  async execute(userId: string): Promise<CurrentUserResult> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    if (user.role?.status !== 'active' || user.role.deletion.isDeleted) {
      throw new UnauthorizedError('No active role assigned');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    };
  }
}