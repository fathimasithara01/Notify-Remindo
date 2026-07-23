import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface CurrentUserResult {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) {}

  async execute(userId: string): Promise<CurrentUserResult> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    const roles = await this.userRepo.listRoles(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: roles.map((r) => r.slug),
    };
  }
}