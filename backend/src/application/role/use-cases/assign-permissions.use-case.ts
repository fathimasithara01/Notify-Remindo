import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository.interface';
import { RoleWithPermissions } from '../../../domain/entities/role.entity';
import { NotFoundError, DomainError } from '../../../domain/errors/domain.error';
import { RolePermissionCache } from '../../../infrastructure/cache/role-permission-cache';

export interface AssignPermissionsDto {
  roleId: string;
  permissionIds: string[];
}

@injectable()
export class AssignPermissionsUseCase {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.PermissionRepository) private permissionRepo: IPermissionRepository,
    @inject(TOKENS.RolePermissionCache) private cache: RolePermissionCache
  ) {}

  async execute(data: AssignPermissionsDto): Promise<RoleWithPermissions> {
    const role = await this.roleRepo.findById(data.roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    await this.permissionRepo.assignToRole(data.roleId, data.permissionIds);
    this.cache.invalidate(data.roleId);

    const updated = await this.roleRepo.findWithPermissions(data.roleId);
    if (!updated) {
      throw new DomainError('Failed to load role after assigning permissions');
    }

    return updated;
  }
}