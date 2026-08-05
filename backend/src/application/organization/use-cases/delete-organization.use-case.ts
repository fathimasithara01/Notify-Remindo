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

const DEACTIVATION_BATCH_SIZE = 100;

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

    let deactivatedCount = 0;
    let page = 1;

    // Paginate through all users in the org — don't assume they fit on one page
    while (true) {
      const { items: orgUsers, meta } = await this.userRepo.list({
        organizationId: input.organizationId,
        page,
        limit: DEACTIVATION_BATCH_SIZE,
      });

      for (const user of orgUsers) {
        await this.userRepo.update(user.id, { status: 'inactive' });
      }

      deactivatedCount += orgUsers.length;

      if (page >= meta.totalPages) break;
      page++;
    }

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'DELETE_ORGANIZATION',
      targetType: 'Organization',
      targetId: input.organizationId,
      metadata: { deactivatedUserCount: deactivatedCount },
    });
  }
}