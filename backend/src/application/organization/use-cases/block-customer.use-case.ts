import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface BlockCustomerDto {
  organizationId: string;
  adminId: string;
  reason?: string;
}

@injectable()
export class BlockCustomerUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(data: BlockCustomerDto): Promise<Organization> {
    const organization = await this.orgRepo.block(data.organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    await this.auditLogRepo.create({
      adminId: data.adminId,
      action: 'BLOCK_CUSTOMER',
      targetType: 'Organization',
      targetId: organization.id,
      metadata: data.reason ? { reason: data.reason } : undefined,
    });

    return organization;
  }
}