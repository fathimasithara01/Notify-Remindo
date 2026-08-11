import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ALL_PERMISSIONS } from '../../../shared/constants/permissions.constant';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { NewRole, Role } from '../../../domain/entities/role.entity';

interface CreateRoleInput {
  name: string;
  description?: string;
  organizationId?: string;
  permissionIds: string[];
  createdBy: string;
}

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private roleRepository: IRoleRepository) {}

  async execute(input: CreateRoleInput): Promise<Role> {
    const invalid = input.permissionIds.filter((p) => !ALL_PERMISSIONS.includes(p as any));
    if (invalid.length > 0) {
      throw new Error(`Invalid permission(s): ${invalid.join(', ')}`);
    }

    const newRole: NewRole = {
      name: input.name,
      description: input.description,
      organizationId: input.organizationId,
      permissionIds: input.permissionIds,
      status: 'active',
      createdBy: input.createdBy,
    };

    return this.roleRepository.create(newRole);
  }
}