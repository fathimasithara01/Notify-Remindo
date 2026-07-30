import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../infrastructure/di/tokens";

import {
  IFeatureRepository,
} from "../../domain/repositories/feature.repository.interface";

import {
  CreateFeatureUseCase,
} from "../../application/subscription/use-cases/create-feature.use-case";

import {
  UpdateFeatureUseCase,
} from "../../application/subscription/use-cases/update-feature.use-case";

import {
  DeleteFeatureUseCase,
} from "../../application/subscription/use-cases/delete-feature.use-case";

import {
  ApiResponse,
} from "../../shared/utils/api-response";

import {
  NotFoundError,
  UnauthorizedError,
} from "../../domain/errors/domain.error";



@injectable()
export class FeatureController {

  constructor(

    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository:
      IFeatureRepository,

    @inject(TOKENS.CreateFeatureUseCase)
    private readonly createFeatureUseCase:
      CreateFeatureUseCase,

    @inject(TOKENS.UpdateFeatureUseCase)
    private readonly updateFeatureUseCase:
      UpdateFeatureUseCase,

    @inject(TOKENS.DeleteFeatureUseCase)
    private readonly deleteFeatureUseCase:
      DeleteFeatureUseCase,

  ) {}

    createFeature = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    const feature =
      await this.createFeatureUseCase.execute({

        data: req.body,

        adminId: req.user.userId,

      });

    ApiResponse.created(
      res,
      feature,
      "Feature created successfully"
    );

  };



  listFeatures = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    const result =
      await this.featureRepository.list({

        status:
          req.query.status as
            | "active"
            | "inactive"
            | undefined,

        search:
          req.query.search as string | undefined,

        page:
          req.query.page
            ? Number(req.query.page)
            : 1,

        limit:
          req.query.limit
            ? Number(req.query.limit)
            : 10,

      });

    ApiResponse.success(
      res,
      result
    );

  };


  getFeatureById = async (
  req: Request,
  res: Response
): Promise<void> => {

  const feature =
    await this.featureRepository.findById(
      req.params.id
    );

  if (!feature) {

    throw new NotFoundError(
      "Feature not found"
    );

  }

  ApiResponse.success(
    res,
    feature
  );

};



updateFeature = async (
  req: Request,
  res: Response
): Promise<void> => {

  if (!req.user) {

    throw new UnauthorizedError();

  }

  const updatedFeature =
    await this.updateFeatureUseCase.execute({

      featureId:
        req.params.id,

      adminId:
        req.user.userId,

      data:
        req.body,

    });

  ApiResponse.success(
    res,
    updatedFeature,
    200,
    "Feature updated successfully"
  );

};
  deleteFeature = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    if (!req.user) {
      throw new UnauthorizedError();
    }

    await this.deleteFeatureUseCase.execute({

      featureId:
        req.params.id,

      adminId:
        req.user.userId,

    });

    ApiResponse.success(
      res,
      null,
      200,
      "Feature deleted successfully"
    );

  };

}