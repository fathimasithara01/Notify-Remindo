import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';

import { NotFoundError, UnauthorizedError} from '../../../domain/errors/domain.error';


interface SetOrganizationAdminPasswordInput {
    organizationId: string;
    password: string;
    adminId: string;
}

@injectable()
export class SetOrganizationAdminPasswordUseCase {
    constructor(
        @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
        @inject(TOKENS.AuditLogRepository) private auditRepo: IAuditLogRepository,
    ) { }

    async execute(input: SetOrganizationAdminPasswordInput): Promise<void> {
        const user = await this.userRepo.findOrganizationAdmin(input.organizationId);
        if (!user) throw new NotFoundError('Organization admin not found');

        const passwordHash = await bcrypt.hash(input.password, 12);

        const updated = await this.userRepo.resetPassword(user.id, passwordHash);
        if (!updated) throw new UnauthorizedError('Password reset failed');

        await this.auditRepo.create({
            adminId: input.adminId,
            action: 'RESET_ORGANIZATION_ADMIN_PASSWORD',
            targetType: 'User',
            targetId: user.id,
            metadata: {
                organizationId: input.organizationId,
            },
        });
    }
}