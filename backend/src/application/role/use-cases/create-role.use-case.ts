import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ALL_PERMISSIONS } from '../../../shared/constants/permissions.constant';
import { NewRole, Role } from '../../../domain/entities/role.entity';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

interface CreateRoleInput {
  name: string;
  description?: string;
  organizationId?: string;
  permissionIds: string[];
  createdBy: string;
}

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TOKENS.PlatformRoleRepository) private roleRepository: IPlatformRoleRepository) {}

  async execute(input: CreateRoleInput): Promise<Role> {
    const invalid = input.permissionIds.filter((p) => !ALL_PERMISSIONS.includes(p as any));
    if (invalid.length > 0) {
      throw new Error(`Invalid permission(s): ${invalid.join(', ')}`);
    }

    const newRole: NewRole = {
      name: input.name,
      description: input.description,
      permissionIds: input.permissionIds,
      status: 'active',
      createdBy: input.createdBy,
    };

    return this.roleRepository.create(newRole);
  }
}