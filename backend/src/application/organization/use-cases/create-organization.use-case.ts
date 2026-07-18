import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { DomainError } from '../../../domain/errors/domain.error';
import { CreateOrganizationDto } from '../../dtos/create-organization.dto';

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(data: CreateOrganizationDto): Promise<Organization> {
    
    const plan = await this.planRepo.findById(data.planId);
    if (!plan || plan.status !== 'active') {
      throw new DomainError('Selected subscription plan is not available');
    }

    const organization = await this.orgRepo.create({
      name: data.name,
      businessDetails: data.businessDetails,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      currentPlanId: data.planId,
      salesmanId: data.salesmanId ?? null,
    });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    await this.planRepo.createSubscriptionRecord({
      organizationId: organization.id,
      planId: plan.id,
      startDate,
      endDate,
      status: 'active',
    });

    return organization;
  }
}