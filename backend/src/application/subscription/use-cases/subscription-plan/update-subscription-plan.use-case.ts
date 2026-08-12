import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/subscription-plan.repository.interface";
import { IFeatureRepository } from "../../../../domain/repositories/feature.repository.interface";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { NotFoundError, ConflictError, ValidationError } from "../../../../domain/errors/domain.error";

interface UpdateSubscriptionPlanCommand {
  planId: string;
  adminId: string;
  data: Partial<Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt" | "deletedAt">>;
}

@injectable()
export class UpdateSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository
  ) { }

  async execute({ planId, data }: UpdateSubscriptionPlanCommand): Promise<SubscriptionPlan> {
    const plan = await this.subscriptionPlanRepository.findById(planId);
    if (!plan) throw new NotFoundError("Subscription plan not found");

    if (data.title && data.title !== plan.title) {
      const existing = await this.subscriptionPlanRepository.findByTitle(data.title);
      if (existing) throw new ConflictError("A subscription plan with this title already exists");
    }

    if (data.featureIds?.length) {
      const validFeatures = await this.featureRepository.findByIds(data.featureIds);
      if (validFeatures.length !== data.featureIds.length) {
        throw new ValidationError("One or more featureIds are invalid");
      }
    }

    const updated = await this.subscriptionPlanRepository.update(planId, data);
    if (!updated) throw new NotFoundError("Subscription plan not found");

    return updated;
  }
}