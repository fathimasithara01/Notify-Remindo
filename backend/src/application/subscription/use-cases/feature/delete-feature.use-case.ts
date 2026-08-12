import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { IFeatureRepository } from "../../../../domain/repositories/feature.repository.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/subscription-plan.repository.interface";
import { NotFoundError, ConflictError } from "../../../../domain/errors/domain.error";

interface DeleteFeatureCommand {
  featureId: string;
  adminId: string;
}

@injectable()
export class DeleteFeatureUseCase {
  constructor(
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository,
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute({ featureId }: DeleteFeatureCommand): Promise<void> {
    const feature = await this.featureRepository.findById(featureId);
    if (!feature) throw new NotFoundError("Feature not found");

    const plansUsingFeature = await this.subscriptionPlanRepository.countByFeatureId(featureId);
    if (plansUsingFeature > 0) {
      throw new ConflictError(
        "Feature is used by one or more subscription plans and cannot be deleted"
      );
    }

    await this.featureRepository.softDelete(featureId);
  }
}