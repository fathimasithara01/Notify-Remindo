import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';
import { ALL_PERMISSIONS } from '../../../shared/constants/permissions.constant';
import { NewRole, Role } from '../../../domain/entities/role.entity';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

interface EditRoleInput {
  id: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
  status?: 'active' | 'inactive';
}

@injectable()
export class EditRoleUseCase {
  constructor(
    @inject(TOKENS.PlatformRoleRepository) private roleRepository: IPlatformRoleRepository,
    @inject(TOKENS.PermissionResolver) private permissionResolver: IPermissionResolver
  ) {}

  async execute(input: EditRoleInput): Promise<Role> {
    const existing = await this.roleRepository.findById(input.id);
    if (!existing) throw new Error('Role not found');

    if (existing.isSystem) {
      throw new Error('System roles cannot be modified');
    }

    if (input.permissionIds) {
      const invalid = input.permissionIds.filter((p) => !ALL_PERMISSIONS.includes(p as any));
      if (invalid.length > 0) throw new Error(`Invalid permission(s): ${invalid.join(', ')}`);
    }

    const updateData: Partial<NewRole> = {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.permissionIds && { permissionIds: input.permissionIds }),
      ...(input.status && { status: input.status }),
    };

    const updated = await this.roleRepository.update(input.id, updateData);
    if (!updated) throw new Error('Role not found');

    // invalidate cache so permission changes take effect immediately
    this.permissionResolver.invalidate(input.id);

    return updated;
  }
}