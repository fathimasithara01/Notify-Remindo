import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
  ISubscriptionPlanRepository,
} from "../../../domain/repositories/subscription-plan.repository.interface";

import {
  IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";

import {
  NotFoundError,
  DomainError,
} from "../../../domain/errors/domain.error";



export interface DeleteSubscriptionPlanInput {

  planId: string;

  adminId: string;

}



@injectable()
export class DeleteSubscriptionPlanUseCase {

  constructor(

    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository:
      ISubscriptionPlanRepository,

    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:
      IAuditLogRepository,

  ) {}



  async execute(
    input: DeleteSubscriptionPlanInput
  ): Promise<void> {

    const {
      planId,
      adminId,
    } = input;



    const existingPlan =
      await this.subscriptionPlanRepository.findById(
        planId
      );

    if (!existingPlan) {

      throw new NotFoundError(
        "Subscription plan not found"
      );

    }



    /**
     * Future enhancement:
     * Prevent deleting plans that are currently
     * assigned to active organization subscriptions.
     *
     * Example:
     *
     * const activeSubscriptions =
     *   await organizationSubscriptionRepository
     *     .countActiveByPlan(planId);
     *
     * if (activeSubscriptions > 0) {
     *   throw new DomainError(
     *     "Cannot delete a plan with active subscriptions."
     *   );
     * }
     */



    const deleted =
      await this.subscriptionPlanRepository.softDelete(
        planId
      );

    if (!deleted) {

      throw new DomainError(
        "Failed to delete subscription plan"
      );

    }



    await this.auditLogRepository.create({

      adminId,

      action:
        "DELETE_SUBSCRIPTION_PLAN",

      targetType:
        "SubscriptionPlan",

      targetId:
        planId,

      metadata: {

        name:
          existingPlan.name,

        status:
          existingPlan.status,

      },

    });

  }

}