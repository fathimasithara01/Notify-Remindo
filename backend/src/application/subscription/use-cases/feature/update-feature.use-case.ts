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
} from "../../../../domain/entities/feature.entity";

import {
  NotFoundError,
  DomainError,
} from "../../../../domain/errors/domain.error";

import {
  UpdateFeatureDto,
} from "../../../dtos/update-feature.dto";



export interface UpdateFeatureInput {

  featureId:string;

  data:UpdateFeatureDto;

  adminId:string;

}




@injectable()
export class UpdateFeatureUseCase {



  constructor(

    @inject(TOKENS.FeatureRepository)
    private readonly featureRepository:IFeatureRepository,


    @inject(TOKENS.AuditLogRepository)
    private readonly auditLogRepository:IAuditLogRepository

  ){}




  async execute(
    input:UpdateFeatureInput
  ):Promise<Feature>{


    const {
      featureId,
      data,
      adminId
    } = input;



    const existingFeature =
      await this.featureRepository.findById(
        featureId
      );



    if(!existingFeature){

      throw new NotFoundError(
        "Feature not found"
      );

    }



    if(
      data.displayOrder !== undefined &&
      data.displayOrder < 0
    ){

      throw new DomainError(
        "Display order cannot be negative"
      );

    }





    const updatedFeature =
      await this.featureRepository.update(

        featureId,


        {

          ...(data.label !== undefined && {

            label:
              data.label.trim()

          }),



          ...(data.description !== undefined && {

            description:
              data.description.trim()

          }),



          ...(data.category !== undefined && {

            category:
              data.category.trim()

          }),



          ...(data.displayOrder !== undefined && {

            displayOrder:
              data.displayOrder

          }),



          ...(data.status !== undefined && {

            status:
              data.status

          })


        }

      );





    if(!updatedFeature){

      throw new DomainError(
        "Unable to update feature"
      );

    }





    await this.auditLogRepository.create({

      adminId,


      action:
        "UPDATE_FEATURE",


      targetType:
        "Feature",


      targetId:
        updatedFeature.id,


      metadata:{

        changes:data,

        key:
          updatedFeature.key

      }

    });





    return updatedFeature;

  }


}