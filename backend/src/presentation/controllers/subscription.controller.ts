import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";
import { ISubscriptionPlanRepository } from "../../domain/repositories/subscription-plan.repository.interface";
import { IFeatureRepository } from "../../domain/repositories/feature.repository.interface";

import { CreateSubscriptionPlanUseCase } from "../../application/subscription/use-cases/subscription-plan/create-subscription-plan.use-case";
import { UpdateSubscriptionPlanUseCase } from "../../application/subscription/use-cases/subscription-plan/update-subscription-plan.use-case";
import { DeleteSubscriptionPlanUseCase } from "../../application/subscription/use-cases/subscription-plan/delete-subscription-plan.use-case";

import { NotFoundError } from "../../domain/errors/domain.error";
import { ApiResponse } from "../../shared/utils/api-response";
import { parsePaginationParams } from "../../shared/utils/pagination";
import { asyncHandler } from "../../shared/utils/async-handler";
import { SubscriptionPlanStatus } from "../../domain/entities/subscription-plan.entity";

@injectable()
export class SubscriptionPlanController {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository)
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository,
    @inject(TOKENS.CreateSubscriptionPlanUseCase)
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    @inject(TOKENS.UpdateSubscriptionPlanUseCase)
    private readonly updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase,
    @inject(TOKENS.DeleteSubscriptionPlanUseCase)
    private readonly deleteSubscriptionPlanUseCase: DeleteSubscriptionPlanUseCase
  ) { }

  createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.createSubscriptionPlanUseCase.execute({
      adminId: req.user!.id,
      data: req.body,
    });

    ApiResponse.created(res, plan, "Subscription plan created successfully");
  });

  listPlans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePaginationParams(req.query as Record<string, unknown>);

    const statusParam = req.query.status as string | undefined;
    const status =
      statusParam && Object.values(SubscriptionPlanStatus).includes(statusParam as SubscriptionPlanStatus)
        ? (statusParam as SubscriptionPlanStatus)
        : undefined;

    const result = await this.subscriptionPlanRepository.list({
      status,
      search: req.query.search as string | undefined,
      page: pagination.page,
      limit: pagination.limit,
    });

    ApiResponse.success(res, result, 200, "Subscription plans fetched successfully");
  });

  getPlanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.subscriptionPlanRepository.findById(req.params.id);

    if (!plan) throw new NotFoundError("Subscription plan not found");

    // plan.featureIds already holds the feature refs — resolve their details
    const features = plan.featureIds.length
      ? await this.featureRepository.findByIds(plan.featureIds)
      : [];

    ApiResponse.success(res, { ...plan, features }, 200, "Subscription plan fetched successfully");
  });

  updatePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updatedPlan = await this.updateSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user!.id,
      data: req.body,
    });

    ApiResponse.success(res, updatedPlan, 200, "Subscription plan updated successfully");
  });

  deletePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.deleteSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user!.id,
    });

    ApiResponse.success(res, null, 200, "Subscription plan deleted successfully");
  });

  blockPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.subscriptionPlanRepository.findById(req.params.id);
    if (!plan) throw new NotFoundError("Subscription plan not found");

    const updatedPlan = await this.updateSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user!.id,
      data: { status: SubscriptionPlanStatus.INACTIVE },
    });

    ApiResponse.success(res, updatedPlan, 200, "Subscription plan blocked successfully");
  });

  unblockPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.subscriptionPlanRepository.findById(req.params.id);
    if (!plan) throw new NotFoundError("Subscription plan not found");

    const updatedPlan = await this.updateSubscriptionPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user!.id,
      data: { status: SubscriptionPlanStatus.ACTIVE },
    });

    ApiResponse.success(res, updatedPlan, 200, "Subscription plan unblocked successfully");
  });
}