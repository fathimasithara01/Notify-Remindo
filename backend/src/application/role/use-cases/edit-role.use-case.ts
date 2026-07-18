import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { Role } from '../../../domain/entities/role.entity';
import { NotFoundError, DomainError } from '../../../domain/errors/domain.error';

export interface EditRoleDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

@injectable()
export class EditRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository) {}

  async execute(roleId: string, data: EditRoleDto): Promise<Role> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    if (role.isSystem && data.status === 'inactive') {
      throw new DomainError('Built-in system roles cannot be deactivated');
    }

    const updated = await this.roleRepo.update(roleId, data);
    if (!updated) {
      throw new NotFoundError('Role not found');
    }

    return updated;
  }
}