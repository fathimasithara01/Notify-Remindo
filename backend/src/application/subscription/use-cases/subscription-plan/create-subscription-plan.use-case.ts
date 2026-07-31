import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/subscription-plan.repository.interface";
import { IPlanFeatureRepository } from "../../../../domain/repositories/plan-feature.repository.interface";
import { IAuditLogRepository } from "../../../../domain/repositories/audit-log.repository.interface";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { CreateSubscriptionPlanDto } from "../../../dtos/create-subscription-plan.dto";
import { DomainError } from "../../../../domain/errors/domain.error";

export interface CreateSubscriptionPlanInput {
  data: CreateSubscriptionPlanDto;
  adminId: string;
}

@injectable()
export class CreateSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private readonly planRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.PlanFeatureRepository) private readonly planFeatureRepository: IPlanFeatureRepository,
    @inject(TOKENS.AuditLogRepository) private readonly auditLogRepository: IAuditLogRepository,
  ) { }

  async execute(input: CreateSubscriptionPlanInput): Promise<SubscriptionPlan> {
    const { data, adminId } = input;

    if (data.priceInMinorUnit < 0) {
      throw new DomainError("Price cannot be negative");
    }

    if (data.trialDays !== undefined && data.trialDays < 0) {
      throw new DomainError("Trial days cannot be negative");
    }

    const plan =
      await this.planRepository.create({
        name: data.name,
        description: data.description,
        priceInMinorUnit: data.priceInMinorUnit,
        currency: data.currency,
        status: 'active',
        billingInterval: data.billingInterval,
        trialDays: data.trialDays,
      });

    if (data.features?.length) {
      for (const feature of data.features) {
        await this.planFeatureRepository.create({
          planId: plan.id,
          featureId: feature.featureId,
          featureValue: feature.featureValue,
        });
      }
    }

    await this.auditLogRepository.create({
      adminId,
      action: "CREATE_SUBSCRIPTION_PLAN",
      targetType: "SubscriptionPlan",
      targetId: plan.id,
      metadata: {
        name: plan.name
      }
    });
    return plan;
  }
}