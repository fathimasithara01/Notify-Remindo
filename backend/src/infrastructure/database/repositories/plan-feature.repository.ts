import { injectable } from "tsyringe";

import {
  IPlanFeatureRepository,
} from "../../../domain/repositories/plan-feature.repository.interface";

import {
  PlanFeature,
  CreatePlanFeatureInput,
  PlanFeatureWithDefinition,
} from "../../../domain/entities/plan-feature.entity";

import {
  PlanFeatureModel,
  PlanFeatureDocument,
} from "../models/plan-feature.model";

import {
  FeatureModel,
} from "../models/feature.model";



@injectable()
export class PlanFeatureRepository
implements IPlanFeatureRepository {



  async create(
    data: CreatePlanFeatureInput
  ): Promise<PlanFeature> {


    const doc =
      await PlanFeatureModel.create(data);


    return this.toDomain(doc);

  }

  async findByPlanAndFeature(
    planId:string,
    featureId:string
  ):Promise<PlanFeature|null>{


    const doc =
      await PlanFeatureModel.findOne({

        planId,

        featureId

      });

    return doc
      ? this.toDomain(doc)
      : null;

  }

  async update(
    planId:string,
    featureId:string,
    featureValue:string|number|boolean
  ):Promise<PlanFeature|null>{


    const doc =
      await PlanFeatureModel.findOneAndUpdate(

        {
          planId,
          featureId
        },

        {
          featureValue
        },

        {
          new:true
        }

      );



    return doc
      ? this.toDomain(doc)
      : null;

  }

  async remove(
    planId:string,
    featureId:string
  ):Promise<boolean>{


    const result =
      await PlanFeatureModel.findOneAndDelete({

        planId,

        featureId

      });



    return !!result;

  }

  async listByFeature(
  featureId: string
): Promise<PlanFeature[]> {

  const docs = await PlanFeatureModel.find({
    featureId,
  });

  return docs.map((doc) => this.toDomain(doc));
}

  async listByPlan(   planId:string ):Promise<PlanFeatureWithDefinition[]>{


    const mappings =
      await PlanFeatureModel.find({
        planId
      });



    const featureIds =
      mappings.map(
        item=>item.featureId
      );



    const features =
      await FeatureModel.find({

        _id:{
          $in:featureIds
        }

      });




    const featureMap =
      new Map(

        features.map(
          feature=>[
            feature._id.toString(),
            feature
          ]
        )

      );




    return mappings.map(
      mapping=>{


        const feature =
          featureMap.get(
            mapping.featureId.toString()
          );



        return {

          ...this.toDomain(mapping),


          key:
            feature?.key ?? "",


          label:
            feature?.label ?? "",


          dataType:
            feature?.dataType ?? "string"

        };

      }

    );

  }






  private toDomain(
    doc:PlanFeatureDocument
  ):PlanFeature{


    return {

      id:
        doc._id.toString(),


      planId:
        doc.planId.toString(),


      featureId:
        doc.featureId.toString(),


      featureValue:
        doc.featureValue,

deletedAt: doc.deletedAt,

      createdAt:
        doc.createdAt,


      updatedAt:
        doc.updatedAt,

    };

  }


}