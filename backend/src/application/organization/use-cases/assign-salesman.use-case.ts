import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

export interface AssignSalesmanDto {
  organizationId: string;
  salesmanId: string;
}

@injectable()
export class AssignSalesmanUseCase {
  constructor(@inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository) {}

  async execute(data: AssignSalesmanDto): Promise<Organization> {
    const organization = await this.orgRepo.assignSalesman(
      data.organizationId,
      data.salesmanId
    );
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    return organization;
  }
}