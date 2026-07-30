import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/subscription-plan.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { DomainError, NotFoundError } from '../../../domain/errors/domain.error';
import { IOrganizationSubscriptionRepository } from "../../../domain/repositories/organization-subscription.repository.interface";

export interface UpgradePlanDto {
  organizationId: string;
  newPlanId: string;
}

@injectable()
export class UpgradePlanUseCase {
  constructor(
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.OrganizationSubscriptionRepository) private readonly organizationSubscriptionRepository: IOrganizationSubscriptionRepository,
  ) { }

  async execute(data: UpgradePlanDto): Promise<Organization> {
    const organization = await this.orgRepo.findById(data.organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const newPlan = await this.organizationSubscriptionRepository.findById(data.newPlanId);
    if (!newPlan || newPlan.status !== 'active') {
      throw new DomainError('Selected subscription plan is not available');
    }

    if (organization.currentPlanId === data.newPlanId) {
      throw new DomainError('Organization is already on this plan');
    }

    const activeSubscription = await this.organizationSubscriptionRepository.findActiveSubscription(data.organizationId);
    if (activeSubscription) {
      await this.organizationSubscriptionRepository.updateStatus(
        activeSubscription.id,
        {
          status: "upgraded",
        }
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    switch (newPlan.billingInterval) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    await this.organizationSubscriptionRepository.create({
      organizationId: organization.id,
      planId: newPlan.id,

      startDate,
      endDate,
      nextBillingDate: endDate,

      priceInMinorUnit: newPlan.priceInMinorUnit,

      currency: newPlan.currency,

      billingInterval: newPlan.billingInterval,

      paymentProvider: undefined,

      paymentTransactionId: undefined,

      autoRenew: false,

      status: "active",

    });
    
    const updated = await this.orgRepo.changePlan(data.organizationId, data.newPlanId);
    if (!updated) {
      throw new NotFoundError('Organization not found');
    }

    return updated;
  }
}