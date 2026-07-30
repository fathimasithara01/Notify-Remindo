import { injectable, inject } from "tsyringe";

import { TOKENS } from "../../../../infrastructure/di/tokens";

import {
  IFeatureRepository,
} from "../../../../domain/repositories/feature.repository.interface";

import {
  IAuditLogRepository,
} from "../../../../domain/repositories/audit-log.repository.interface";

import {
  Feature,
  FeatureStatus,
} from "../../../../domain/entities/feature.entity";

import {
  ConflictError,
  DomainError,
} from "../../../../domain/errors/domain.error";

import {
  CreateFeatureDto,
} from "../../../dtos/create-feature.dto";

export interface CreateFeatureInput {
  data: CreateFeatureDto;
  adminId: string;
}

@injectable()
export class CreateFeatureUseCase {

  constructor(

    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository:
      IFeatureRepository,


    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:
      IAuditLogRepository

  ) { }



  async execute(input: CreateFeatureInput): Promise<Feature> {
    const { data, adminId } = input;

    const key = data.key.trim().toLowerCase();

    if (!key) {
      throw new DomainError(
        "Feature key is required"
      );

    }

    const existing = await this.featureRepository.findByKey(key);
    if (existing) {

      throw new ConflictError(
        `Feature with key "${key}" already exists`
      );

    }

    const feature =
      await this.featureRepository.create({

        key,


        label:
          data.label.trim(),


        description:
          data.description,


        category:
          data.category,


        dataType:
          data.dataType,


        displayOrder:
          data.displayOrder ?? 0,


        status:
          data.status ?? FeatureStatus.ACTIVE,

      });



    await this.auditLogRepository.create({

      adminId,


      action:
        "CREATE_FEATURE",


      targetType:
        "Feature",


      targetId:
        feature.id,


      metadata: {
        key: feature.key
      }

    });



    return feature;

  }

}