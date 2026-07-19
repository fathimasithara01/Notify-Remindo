import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface CurrentUserResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository
  ) { }

  async execute(userId: string): Promise<CurrentUserResult> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User no longer exists');

    const role = await this.roleRepo.findById(user.roleId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role?.slug ?? '',
    };
  }
}