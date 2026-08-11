import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";

import {
  ISubscriptionPlanRepository,
} from "../../domain/repositories/subscription-plan.repository.interface";

import {
  CreateSubscriptionPlanUseCase,
} from "../../application/subscription/use-cases/subscription-plan/create-subscription-plan.use-case";

import {
  UpdateSubscriptionPlanUseCase,
} from "../../application/subscription/use-cases/subscription-plan/update-subscription-plan.use-case";

import {
  UnauthorizedError,
  NotFoundError,
} from "../../domain/errors/domain.error";

import {
  ApiResponse,
} from "../../shared/utils/api-response";

import {  paginationMeta, parsePaginationParams } from '../../shared/utils/pagination';


import { DeleteSubscriptionPlanUseCase }
  from "../../application/subscription/use-cases/subscription-plan/delete-subscription-plan.use-case";

import {
  IPlanFeatureRepository,
} from "../../domain/repositories/plan-feature.repository.interface";

@injectable()
export class SubscriptionPlanController {

  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.CreateSubscriptionPlanUseCase) private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    @inject(TOKENS.UpdateSubscriptionPlanUseCase) private readonly updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase,
    @inject(TOKENS.PlanFeatureRepository) private readonly planFeatureRepository: IPlanFeatureRepository,
    @inject(TOKENS.DeleteSubscriptionPlanUseCase) private readonly deleteSubscriptionPlanUseCase: DeleteSubscriptionPlanUseCase,
  ) { }

  createPlan = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const plan = await this.createSubscriptionPlanUseCase.execute({
      adminId: req.user.id,
      data: req.body,
    });

    ApiResponse.created(res, plan, "Subscription plan created successfully");
  };

  listPlans = async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePaginationParams(req.query as Record<string, unknown>);

    const result = await this.subscriptionPlanRepository.list({
      status: req.query.status as any,
      search: req.query.search as string | undefined,
      page: pagination.page,
      limit: pagination.limit,
    });

    ApiResponse.success(res, result, 200, "Subscription plans fetched successfully");
  };

  getPlanById = async (req: Request, res: Response): Promise<void> => {
    const plan = await this.subscriptionPlanRepository.findById(req.params.id);

    if (!plan) throw new NotFoundError("Subscription plan not found");

    const features = await this.planFeatureRepository.listByPlan(plan.id);

    ApiResponse.success(res, { ...plan, features, }, 200, "Subscription plan fetched successfully");
  };


  updatePlan = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const updatedPlan = await this.updateSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user.id,
      data: req.body,
    });

    ApiResponse.success(res, updatedPlan, 200, "Subscription plan updated successfully");
  };

  deletePlan = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    await this.deleteSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user.id,
    });

    ApiResponse.success(res, null, 200, "Subscription plan deleted successfully");
  };
}
