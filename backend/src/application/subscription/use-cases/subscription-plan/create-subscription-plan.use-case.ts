import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/subscription-plan.repository.interface";
import { IFeatureRepository } from "../../../../domain/repositories/feature.repository.interface";
import { CreateSubscriptionPlanInput, SubscriptionPlan, SubscriptionPlanStatus } from "../../../../domain/entities/subscription-plan.entity";
import { ConflictError, ValidationError } from "../../../../domain/errors/domain.error";

interface CreateSubscriptionPlanCommand {
  data: CreateSubscriptionPlanInput;
  adminId: string;
}

@injectable()
export class CreateSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository
  ) {}

  async execute({ data }: CreateSubscriptionPlanCommand): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionPlanRepository.findByTitle(data.title);
    if (existing) {
      throw new ConflictError("A subscription plan with this title already exists");
    }

    if (data.featureIds?.length) {
      const validFeatures = await this.featureRepository.findByIds(data.featureIds);
      if (validFeatures.length !== data.featureIds.length) {
        throw new ValidationError("One or more featureIds are invalid");
      }
    }

    return this.subscriptionPlanRepository.create({
      ...data,
      status: data.status ?? SubscriptionPlanStatus.ACTIVE,
    });
  }
}