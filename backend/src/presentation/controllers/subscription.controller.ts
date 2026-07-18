import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { ISubscriptionPlanRepository } from '../../domain/repositories/subscription-plan.repository.interface';
import { IFeatureRepository } from '../../domain/repositories/feature.repository.interface';
import { CreatePlanUseCase } from '../../application/subscription/use-cases/create-plan.use-case';
import { EditPlanUseCase } from '../../application/subscription/use-cases/edit-plan.use-case';
import { CreateFeatureUseCase } from '../../application/subscription/use-cases/create-feature.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError } from '../../domain/errors/domain.error';

@injectable()
export class SubscriptionController {
  constructor(
    @inject(TOKENS.SubscriptionPlanRepository) private planRepo: ISubscriptionPlanRepository,
    @inject(TOKENS.FeatureRepository) private featureRepo: IFeatureRepository,
    @inject(TOKENS.CreatePlanUseCase) private createPlanUseCase: CreatePlanUseCase,
    @inject(TOKENS.EditPlanUseCase) private editPlanUseCase: EditPlanUseCase,
    @inject(TOKENS.CreateFeatureUseCase) private createFeatureUseCase: CreateFeatureUseCase
  ) { }


  createPlan = async (req: Request, res: Response): Promise<void> => {
    const plan = await this.createPlanUseCase.execute(req.body);
    ApiResponse.created(res, plan);
  };

  listPlans = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;
    const plans = await this.planRepo.list({ status: status as 'active' | 'inactive' | undefined });
    ApiResponse.success(res, plans);
  };

  getPlan = async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planRepo.findById(req.params.id as string);
    if (!plan) throw new NotFoundError('Plan not found');

    const features = await this.planRepo.listFeatures(plan.id);
    ApiResponse.success(res, { ...plan, features });
  };

  updatePlan = async (req: Request, res: Response): Promise<void> => {
    const plan = await this.editPlanUseCase.execute(req.params.id as string, req.body);
    ApiResponse.success(res, plan, 200, 'Plan updated');
  };

  deletePlan = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.planRepo.delete(req.params.id as string);
    if (!deleted) throw new NotFoundError('Plan not found');
    ApiResponse.success(res, null, 200, 'Plan deleted');
  };

  setPlanFeature = async (req: Request, res: Response): Promise<void> => {
    const planFeature = await this.planRepo.setFeature({
      planId: req.params.id as string,
      featureId: req.body.featureId,
      featureValue: req.body.featureValue,
    });
    ApiResponse.success(res, planFeature, 200, 'Plan feature set');
  };

  removePlanFeature = async (req: Request, res: Response): Promise<void> => {
    const removed = await this.planRepo.removeFeature(req.params.id as string, req.params.featureId as string);
    if (!removed) throw new NotFoundError('Plan feature not found');
    ApiResponse.success(res, null, 200, 'Plan feature removed');
  };


  createFeature = async (req: Request, res: Response): Promise<void> => {
    const feature = await this.createFeatureUseCase.execute(req.body);
    ApiResponse.created(res, feature);
  };

  listFeatures = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;
    const features = await this.featureRepo.list({
      status: status as 'active' | 'inactive' | undefined,
    });
    ApiResponse.success(res, features);
  };
}