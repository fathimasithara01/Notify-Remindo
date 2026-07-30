import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../infrastructure/di/tokens";

import {
  IFeatureRepository,
} from "../../../domain/repositories/feature.repository.interface";

import {
  IPlanFeatureRepository,
} from "../../../domain/repositories/plan-feature.repository.interface";

import {
  IAuditLogRepository,
} from "../../../domain/repositories/audit-log.repository.interface";

import {
  NotFoundError,
  ConflictError,
  DomainError,
} from "../../../domain/errors/domain.error";



export interface DeleteFeatureInput {

  featureId: string;

  adminId: string;

}



@injectable()
export class DeleteFeatureUseCase {

  constructor(

    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository:
      IFeatureRepository,

    @inject(TOKENS.PlanFeatureRepository)
    private readonly planFeatureRepository:
      IPlanFeatureRepository,

    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:
      IAuditLogRepository,

  ) {}



  async execute(
    input: DeleteFeatureInput
  ): Promise<void> {

    const {
      featureId,
      adminId,
    } = input;



    const feature =
      await this.featureRepository.findById(
        featureId
      );

    if (!feature) {

      throw new NotFoundError(
        "Feature not found"
      );

    }



    /**
     * Prevent deleting a feature that is
     * currently assigned to subscription plans.
     */
    const assignments =
      await this.planFeatureRepository.listByFeature(
        featureId
      );

    if (assignments.length > 0) {

      throw new ConflictError(
        "Feature is assigned to one or more subscription plans"
      );

    }



    const deleted =
      await this.featureRepository.softDelete(
        featureId
      );

    if (!deleted) {

      throw new DomainError(
        "Failed to delete feature"
      );

    }



    await this.auditLogRepository.create({

      adminId,

      action:
        "DELETE_FEATURE",

      targetType:
        "Feature",

      targetId:
        feature.id,

      metadata: {

        key:
          feature.key,

        label:
          feature.label,

      },

    });

  }

}