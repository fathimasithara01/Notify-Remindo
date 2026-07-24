import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ISubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository.interface';
import { IFeatureRepository } from '../../domain/repositories/feature.repository.interface';
import { CreatePlanUseCase } from '../../application/subscription/use-cases/create-plan.use-case';
import { EditPlanUseCase } from '../../application/subscription/use-cases/edit-plan.use-case';
import { CreateFeatureUseCase } from '../../application/subscription/use-cases/create-feature.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class SubscriptionController {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.FeatureRepository) private featureRepo: IFeatureRepository,
    @inject(TOKENS.CreatePlanUseCase) private createPlanUseCase: CreatePlanUseCase,
    @inject(TOKENS.EditPlanUseCase) private editPlanUseCase: EditPlanUseCase,
    @inject(TOKENS.CreateFeatureUseCase) private createFeatureUseCase: CreateFeatureUseCase
  ) {}

  // --- Plans ---

  createPlan = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const plan = await this.createPlanUseCase.execute({ data: req.body, adminId: req.user.userId });
    ApiResponse.created(res, plan);
  };

  listPlans = async (req: Request, res: Response): Promise<void> => {
    const { status, search } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const plans = await this.planRepo.list({
      status: status as 'active' | 'inactive' | undefined,
      search: search as string | undefined,
    });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = plans.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(plans.length, pagination),
    });
  };

  getPlan = async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planRepo.findById(req.params.id);
    if (!plan) throw new NotFoundError('Plan not found');

    const features = await this.planRepo.listFeatures(plan.id);
    ApiResponse.success(res, { ...plan, features });
  };

  updatePlan = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const plan = await this.editPlanUseCase.execute({
      planId: req.params.id,
      adminId: req.user.userId,
      data: req.body,
    });
    ApiResponse.success(res, plan, 200, 'Plan updated');
  };

  deletePlan = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.planRepo.delete(req.params.id);
    if (!deleted) throw new NotFoundError('Plan not found');
    ApiResponse.success(res, null, 200, 'Plan deleted');
  };

  setPlanFeature = async (req: Request, res: Response): Promise<void> => {
    const planFeature = await this.planRepo.setFeature({
      planId: req.params.id,
      featureId: req.body.featureId,
      featureValue: req.body.featureValue,
    });
    ApiResponse.success(res, planFeature, 200, 'Plan feature set');
  };

  removePlanFeature = async (req: Request, res: Response): Promise<void> => {
    const removed = await this.planRepo.removeFeature(req.params.id, req.params.featureId);
    if (!removed) throw new NotFoundError('Plan feature not found');
    ApiResponse.success(res, null, 200, 'Plan feature removed');
  };

  // --- Features ---

  createFeature = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const feature = await this.createFeatureUseCase.execute({
      data: req.body,
      adminId: req.user.userId,
    });
    ApiResponse.created(res, feature);
  };

  listFeatures = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const features = await this.featureRepo.list({
      status: status as 'active' | 'inactive' | undefined,
    });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = features.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(features.length, pagination),
    });
  };

  getFeature = async (req: Request, res: Response): Promise<void> => {
    const feature = await this.featureRepo.findById(req.params.id);
    if (!feature) throw new NotFoundError('Feature not found');
    ApiResponse.success(res, feature);
  };

  updateFeature = async (req: Request, res: Response): Promise<void> => {
    const feature = await this.featureRepo.update(req.params.id, req.body);
    if (!feature) throw new NotFoundError('Feature not found');
    ApiResponse.success(res, feature, 200, 'Feature updated');
  };

  deleteFeature = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.featureRepo.delete(req.params.id);
    if (!deleted) throw new NotFoundError('Feature not found');
    ApiResponse.success(res, null, 200, 'Feature deleted');
  };
}