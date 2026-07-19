import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface EditOrganizationDto {
  name?: string;
  businessDetails?: Record<string, unknown>;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface EditOrganizationInput {
  organizationId: string;
  adminId: string;
  data: EditOrganizationDto;
}

@injectable()
export class EditOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository
  ) {}

  async execute(input: EditOrganizationInput): Promise<Organization> {
    const updated = await this.orgRepo.update(input.organizationId, input.data);
    if (!updated) {
      throw new NotFoundError('Organization not found');
    }

    await this.auditLogRepo.create({
      adminId: input.adminId,
      action: 'EDIT_ORGANIZATION',
      targetType: 'Organization',
      targetId: updated.id,
      metadata: { changes: input.data },
    });

    return updated;
  }
}