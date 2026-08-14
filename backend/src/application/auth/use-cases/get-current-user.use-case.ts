import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface CurrentUserResult {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private readonly platformRoleRepo: IPlatformRoleRepository,
    @inject(TOKENS.PermissionResolver) private readonly permissionResolver: IPermissionResolver
  ) { }

  async execute(userId: string): Promise<CurrentUserResult> {
    const user = await this.platformUserRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User no longer exists');
    if (user.status === 'inactive') {
      throw new UnauthorizedError('This account is no longer active');
    }
    const role = await this.platformRoleRepo.findById(user.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new UnauthorizedError('No active role assigned');
    }

    const permissions = await this.permissionResolver.resolve(role.id);

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: role.name,
      permissions: Array.from(permissions),
    };
  }
}