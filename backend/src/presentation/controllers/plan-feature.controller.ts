import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";

import {
  IPlanFeatureRepository,
} from "../../domain/repositories/plan-feature.repository.interface";

import {
  AddPlanFeatureUseCase,
} from "../../application/subscription/use-cases/plan-feature/add-plan-feature.use-case";

import {
  RemovePlanFeatureUseCase,
} from "../../application/subscription/use-cases/plan-feature/remove-plan-feature.use-case";

import {
  ApiResponse,
} from "../../shared/utils/api-response";

import {
  UnauthorizedError,
} from "../../domain/errors/domain.error";



@injectable()
export class PlanFeatureController {

  constructor(

    @inject(TOKENS.PlanFeatureRepository)
    private readonly planFeatureRepository:
      IPlanFeatureRepository,

    @inject(TOKENS.AddPlanFeatureUseCase)
    private readonly addPlanFeatureUseCase:
      AddPlanFeatureUseCase,

    @inject(TOKENS.RemovePlanFeatureUseCase)
    private readonly removePlanFeatureUseCase:
      RemovePlanFeatureUseCase,

  ) {}

    addPlanFeature = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    const planFeature =
      await this.addPlanFeatureUseCase.execute({

        adminId:
          req.user.id,

        data: {

          planId:
            req.params.planId,

          featureId:
            req.body.featureId,

          featureValue:
            req.body.featureValue,

        },

      });

    ApiResponse.created(
      res,
      planFeature,
      "Feature added to subscription plan successfully"
    );

  };



  listPlanFeatures = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    const features =
      await this.planFeatureRepository.listByPlan(
        req.params.planId
      );

    ApiResponse.success(
      res,
      features
    );

  };

    removePlanFeature = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    await this.removePlanFeatureUseCase.execute({

      planId:
        req.params.planId,

      featureId:
        req.params.featureId,

      adminId:
        req.user.id,

    });

    ApiResponse.success(
      res,
      null,
      200,
      "Feature removed from subscription plan successfully"
    );

  };

}