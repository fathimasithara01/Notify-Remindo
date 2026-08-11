import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

export interface CurrentUserResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private readonly platformRoleRepo: IPlatformRoleRepository
  ) {}

  async execute(userId: string): Promise<CurrentUserResult> {
    const user = await this.platformUserRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User no longer exists');

    const role = await this.platformRoleRepo.findById(user.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new UnauthorizedError('No active role assigned');
    }

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: role.name,
    };
  }
}