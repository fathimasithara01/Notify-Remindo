import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { DomainError } from '../../../domain/errors/domain.error';

export interface DeleteRoleInput {
    roleId: string;
    adminId: string;
}

@injectable()
export class DeleteRoleUseCase {
    constructor(
        @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
        @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
    ) { }

    async execute(input: DeleteRoleInput): Promise<void> {
        const deleted = await this.roleRepo.delete(input.roleId);
        if (!deleted) {
            const role = await this.roleRepo.findById(input.roleId);
            if (role?.isSystem) {
                throw new DomainError('Built-in system roles cannot be deleted');
            }
            throw new DomainError('Role not found or could not be deleted');
        }

        await this.auditLogRepo.create({
            adminId: input.adminId,
            action: 'DELETE_ROLE',
            targetType: 'Role',
            targetId: input.roleId,
        });
    }
}