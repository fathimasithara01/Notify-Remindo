import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

interface DeleteRoleInput {
  id: string;
  deletedBy: string;
}

@injectable()
export class DeleteRoleUseCase {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepository: IRoleRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository,
    @inject(TOKENS.PermissionResolver) private permissionResolver: IPermissionResolver
  ) {}

  async execute(input: DeleteRoleInput): Promise<void> {
    const role = await this.roleRepository.findById(input.id);
    if (!role) throw new Error('Role not found');

    if (role.isSystem) {
      throw new Error('System roles cannot be deleted');
    }

    const usersWithRole = await this.userRepository.countByRoleId(input.id);
    if (usersWithRole > 0) {
      throw new Error(`Cannot delete role: ${usersWithRole} user(s) still assigned`);
    }

    const success = await this.roleRepository.softDelete(input.id, input.deletedBy);
    if (!success) throw new Error('Delete failed');

    this.permissionResolver.invalidate(input.id);
  }
}