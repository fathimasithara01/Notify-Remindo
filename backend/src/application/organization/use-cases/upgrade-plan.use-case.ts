import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';

export interface UpgradePlanDto {
  organizationId: string;
  newPlanId: string;
}

@injectable()
export class UpgradePlanUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository
  ) {}

  async execute(data: UpgradePlanDto): Promise<Organization> {
    const organization = await this.orgRepo.findById(data.organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const newPlan = await this.planRepo.findById(data.newPlanId);
    if (!newPlan || newPlan.status !== 'active') {
      throw new DomainError('Selected subscription plan is not available');
    }

    if (organization.currentPlanId === data.newPlanId) {
      throw new DomainError('Organization is already on this plan');
    }

    const history = await this.planRepo.listSubscriptionHistory(data.organizationId);
    const activeRecord = history.find((record) => record.status === 'active');
    if (activeRecord) {
      await this.planRepo.closeSubscriptionRecord(activeRecord.id, 'upgraded');
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newPlan.durationDays);

    await this.planRepo.createSubscriptionRecord({
      organizationId: data.organizationId,
      planId: newPlan.id,
      startDate,
      endDate,
      status: 'active',
    });

    const updated = await this.orgRepo.changePlan(data.organizationId, data.newPlanId);
    if (!updated) {
      throw new NotFoundError('Organization not found');
    }

    return updated;
  }
}