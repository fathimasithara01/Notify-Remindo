import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { Role } from '../../../domain/entities/role.entity';
import { NotFoundError, DomainError } from '../../../domain/errors/domain.error';
import { RolePermissionCache } from '../../../infrastructure/cache/role-permission-cache';

export interface EditRoleDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface EditRoleInput {
  roleId: string;
  adminId: string;
  data: EditRoleDto;
}

@injectable()
export class EditRoleUseCase {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository,
    @inject(TOKENS.RolePermissionCache) private cache: RolePermissionCache
  ) {}

  async execute(input: EditRoleInput): Promise<Role> {
    const role = await this.roleRepo.findById(input.roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    if (role.isSystem && input.data.status === 'inactive') {
      throw new DomainError('Built-in system roles cannot be deactivated');
    }

    const updated = await this.roleRepo.update(input.roleId, input.data);
    if (!updated) {
      throw new NotFoundError('Role not found');
    }

    this.cache.invalidate(input.roleId);

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'EDIT_ROLE',
      targetType: 'Role',
      targetId: updated.id,
      metadata: { changes: input.data },
    });

    return updated;
  }
}