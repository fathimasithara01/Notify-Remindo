import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';

import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';

import { Organization } from '../../../domain/entities/organization.entity';
import { SubscriptionPlanStatus } from '../../../domain/entities/subscription-plan.entity';
import {
  DomainError,
  NotFoundError,
} from '../../../domain/errors/domain.error';

export interface UpgradePlanDto {
  organizationId: string;
  newPlanId: string;
}

@injectable()
export class UpgradePlanUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository)
    private readonly orgRepo: IOrganizationRepository,

    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepo: ISubscriptionPlanRepository
  ) {}

  async execute(data: UpgradePlanDto): Promise<Organization> {
    const organization = await this.orgRepo.findById(data.organizationId);

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const newPlan = await this.subscriptionPlanRepo.findById(data.newPlanId);

    if (!newPlan || newPlan.status !== SubscriptionPlanStatus.ACTIVE) {
      throw new DomainError('Selected subscription plan is not available');
    }

    if (organization.currentPlanId === data.newPlanId) {
      throw new DomainError('Organization is already on this plan');
    }

    const updated = await this.orgRepo.changePlan(data.organizationId, data.newPlanId);

    if (!updated) {
      throw new NotFoundError('Organization not found');
    }

    return updated;
  }
}