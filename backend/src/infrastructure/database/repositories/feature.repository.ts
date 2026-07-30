import { injectable } from "tsyringe";

import {
  IFeatureRepository,
} from "../../../domain/repositories/feature.repository.interface";

import {
  FeatureListFilters,
  FeatureListResult,
} from "../../../domain/repositories/feature.repository.interface";

import {
  Feature,
  CreateFeatureInput,
} from "../../../domain/entities/feature.entity";

import {
  FeatureModel,
  FeatureDocument,
} from "../models/feature.model";



@injectable()
export class FeatureRepository
implements IFeatureRepository {



  async create(
    data: CreateFeatureInput
  ): Promise<Feature> {


    const doc =
      await FeatureModel.create(data);


    return this.toDomain(doc);

  }




  async findById(
    id:string
  ):Promise<Feature|null>{


    const doc =
      await FeatureModel.findOne({

        _id:id,

        deletedAt:null

      });



    return doc
      ? this.toDomain(doc)
      : null;

  }


  async findByKey(
    key:string
  ):Promise<Feature|null>{


    const doc =
      await FeatureModel.findOne({

        key:key.toLowerCase(),

        deletedAt:null

      });



    return doc
      ? this.toDomain(doc)
      : null;

  }





  async update(
    id:string,
    data:Partial<CreateFeatureInput>
  ):Promise<Feature|null>{


    const doc =
      await FeatureModel.findOneAndUpdate(

        {
          _id:id,
          deletedAt:null
        },

        data,

        {
          new:true
        }

      );



    return doc
      ? this.toDomain(doc)
      : null;

  }





async softDelete(
  id: string
): Promise<boolean> {

  const result =
    await FeatureModel.findByIdAndUpdate(
      id,
      {
        status: "inactive",
        deletedAt: new Date(),
      }
    );

  return result !== null;
}

async list(
  filters?: FeatureListFilters
): Promise<FeatureListResult> {


  const page =
    filters?.page ?? 1;


  const limit =
    filters?.limit ?? 10;



  const query: Record<string, unknown> = {
    deletedAt: null,
  };



  if (filters?.status) {

    query.status = filters.status;

  }



  if (filters?.search) {

    query.key = {
      $regex: filters.search,
      $options: "i",
    };

  }



  const [
    docs,
    total
  ] = await Promise.all([

    FeatureModel
      .find(query)
      .sort({
        displayOrder: 1
      })
      .skip((page - 1) * limit)
      .limit(limit),


    FeatureModel.countDocuments(query)

  ]);



  return {

    items: docs.map(
      doc => this.toDomain(doc)
    ),

    total,

    page,

    limit,

    totalPages:
      Math.ceil(total / limit),

  };

}
  private toDomain(
    doc:FeatureDocument
  ):Feature{


    return {


      id:
        doc._id.toString(),


      key:
        doc.key,


      label:
        doc.label,


      description:
        doc.description,


      category:
        doc.category,


      dataType:
        doc.dataType,


      displayOrder:
        doc.displayOrder,


      status:
        doc.status,

        deletedAt:doc.deletedAt,

      createdAt:
        doc.createdAt,


      updatedAt:
        doc.updatedAt,

    };

  }


}