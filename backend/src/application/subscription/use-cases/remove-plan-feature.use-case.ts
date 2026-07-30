import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
  IPlanFeatureRepository,
} from "../../../domain/repositories/plan-feature.repository.interface";

import {
  ISubscriptionPlanRepository,
} from "../../../domain/repositories/subscription-plan.repository.interface";

import {
  IFeatureRepository,
} from "../../../domain/repositories/feature.repository.interface";

import {
  IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";

import {
  NotFoundError,
} from "../../../domain/errors/domain.error";



export interface RemovePlanFeatureInput {

  planId: string;

  featureId: string;

  adminId: string;

}



@injectable()
export class RemovePlanFeatureUseCase {


  constructor(

    @inject(TOKENS.PlanFeatureRepository)
    private readonly planFeatureRepository:
      IPlanFeatureRepository,


    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly planRepository:
      ISubscriptionPlanRepository,


    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository:
      IFeatureRepository,


    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:
      IAuditLogRepository

  ) {}



  async execute(
    input: RemovePlanFeatureInput
  ): Promise<void> {


    const {
      planId,
      featureId,
      adminId
    } = input;



    const plan =
      await this.planRepository.findById(
        planId
      );



    if (!plan) {

      throw new NotFoundError(
        "Subscription plan not found"
      );

    }



    const feature =
      await this.featureRepository.findById(
        featureId
      );



    if (!feature) {

      throw new NotFoundError(
        "Feature not found"
      );

    }



    const existing =
      await this.planFeatureRepository
        .findByPlanAndFeature(
          planId,
          featureId
        );



    if (!existing) {

      throw new NotFoundError(
        "Feature is not assigned to this plan"
      );

    }



    const removed =
      await this.planFeatureRepository.remove(
        planId,
        featureId
      );



    if (!removed) {

      throw new Error(
        "Failed to remove plan feature"
      );

    }



    await this.auditLogRepository.create({

      adminId,


      action:
        "REMOVE_PLAN_FEATURE",


      targetType:
        "PlanFeature",


      targetId:
        existing.id,


      metadata:{

        planId,

        feature:
          feature.key

      }

    });

  }

}