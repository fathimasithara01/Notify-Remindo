import { injectable, inject } from "tsyringe";
import { TOKENS } from "../../../../infrastructure/di/tokens";
import { ISubscriptionPlanRepository } from "../../../../domain/repositories/subscription-plan.repository.interface";
import { NotFoundError } from "../../../../domain/errors/domain.error";

interface DeleteSubscriptionPlanCommand {
  planId: string;
  adminId: string;
}

@injectable()
export class DeleteSubscriptionPlanUseCase {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async execute({ planId }: DeleteSubscriptionPlanCommand): Promise<void> {
    const plan = await this.subscriptionPlanRepository.findById(planId);
    if (!plan) throw new NotFoundError("Subscription plan not found");

    await this.subscriptionPlanRepository.softDelete(planId);
  }
}