import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";

import { IFeatureRepository } from "../../domain/repositories/feature.repository.interface";

import { CreateFeatureUseCase } from "../../application/subscription/use-cases/feature/create-feature.use-case";
import { UpdateFeatureUseCase } from "../../application/subscription/use-cases/feature/update-feature.use-case";
import { DeleteFeatureUseCase } from "../../application/subscription/use-cases/feature/delete-feature.use-case";

import { NotFoundError } from "../../domain/errors/domain.error";
import { ApiResponse } from "../../shared/utils/api-response";
import { parsePaginationParams } from "../../shared/utils/pagination";
import { asyncHandler } from "../../shared/utils/async-handler";
import { FeatureStatus } from "../../domain/entities/feature.entity";

@injectable()
export class FeatureController {
  constructor(
    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository: IFeatureRepository,

    @inject(TOKENS.CreateFeatureUseCase)
    private readonly createFeatureUseCase: CreateFeatureUseCase,

    @inject(TOKENS.UpdateFeatureUseCase)
    private readonly updateFeatureUseCase: UpdateFeatureUseCase,

    @inject(TOKENS.DeleteFeatureUseCase)
    private readonly deleteFeatureUseCase: DeleteFeatureUseCase
  ) { }

  createFeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feature = await this.createFeatureUseCase.execute({
      data: req.body,
      adminId: req.user!.id,
    });

    ApiResponse.created(res, feature, "Feature created successfully");
  });

  listFeatures = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePaginationParams(req.query as Record<string, unknown>);

    const statusParam = req.query.status as string | undefined;
    const status =
      statusParam && Object.values(FeatureStatus).includes(statusParam as FeatureStatus)
        ? (statusParam as FeatureStatus)
        : undefined;

    const result = await this.featureRepository.list({
      status,
      search: req.query.search as string | undefined,
      page: pagination.page,
      limit: pagination.limit,
    });

    ApiResponse.success(res, result, 200, "Features fetched successfully");
  });

  getFeatureById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feature = await this.featureRepository.findById(req.params.id);

    if (!feature) throw new NotFoundError("Feature not found");

    ApiResponse.success(res, feature, 200, "Feature fetched successfully");
  });

  updateFeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updatedFeature = await this.updateFeatureUseCase.execute({
      featureId: req.params.id,
      adminId: req.user!.id,
      data: req.body,
    });

    ApiResponse.success(res, updatedFeature, 200, "Feature updated successfully");
  });

  deleteFeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.deleteFeatureUseCase.execute({
      featureId: req.params.id,
      adminId: req.user!.id,
    });

    ApiResponse.success(res, null, 200, "Feature deleted successfully");
  });

  blockFeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feature = await this.featureRepository.findById(req.params.id);
    if (!feature) throw new NotFoundError("Feature not found");

    const updatedFeature = await this.updateFeatureUseCase.execute({
      featureId: req.params.id,
      adminId: req.user!.id,
      data: { status: FeatureStatus.INACTIVE },
    });

    ApiResponse.success(res, updatedFeature, 200, "Feature blocked successfully");
  });

  unblockFeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feature = await this.featureRepository.findById(req.params.id);
    if (!feature) throw new NotFoundError("Feature not found");

    const updatedFeature = await this.updateFeatureUseCase.execute({
      featureId: req.params.id,
      adminId: req.user!.id,
      data: { status: FeatureStatus.ACTIVE },
    });

    ApiResponse.success(res, updatedFeature, 200, "Feature unblocked successfully");
  });

  getFeatureCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await this.featureRepository.getCategories();
    ApiResponse.success(res, categories, 200, "Categories fetched successfully");
  });

}