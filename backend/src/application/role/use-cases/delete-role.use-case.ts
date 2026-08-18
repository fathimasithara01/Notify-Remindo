import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';

interface DeleteRoleInput {
  id: string;
  deletedBy: string;
}

@injectable()
export class DeleteRoleUseCase {
  constructor(
    @inject(TOKENS.PlatformRoleRepository) private roleRepository: IPlatformRoleRepository,
        @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PermissionResolver) private permissionResolver: IPermissionResolver
  ) {}

  async execute(input: DeleteRoleInput): Promise<void> {
    const role = await this.roleRepository.findById(input.id);
    if (!role) throw new Error('Role not found');

    if (role.isSystem) {
      throw new Error('System roles cannot be deleted');
    }

    const usersWithRole = await this.platformUserRepo.countByRoleId(input.id);
    if (usersWithRole > 0) {
      throw new Error(`Cannot delete role: ${usersWithRole} user(s) still assigned`);
    }

    const success = await this.roleRepository.softDelete(input.id, input.deletedBy);
    if (!success) throw new Error('Delete failed');

    this.permissionResolver.invalidate(input.id);
  }
}