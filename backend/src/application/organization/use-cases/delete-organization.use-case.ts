import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface DeleteOrganizationInput {
  organizationId: string;
  adminId: string;
}

@injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: DeleteOrganizationInput): Promise<void> {
    const deleted = await this.orgRepo.delete(input.organizationId);
    if (!deleted) {
      throw new NotFoundError('Organization not found');
    }

    const orgUsers = await this.userRepo.list({ organizationId: input.organizationId });
    for (const user of orgUsers) {
      await this.userRepo.update(user.id, { status: 'inactive' });
    }

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'DELETE_ORGANIZATION',
      targetType: 'Organization',
      targetId: input.organizationId,
      metadata: { deactivatedUserCount: orgUsers.length },
    });
  }
}