import {
  Document,
  Schema,
  model,
} from "mongoose";

import {
  FeatureDataType,
  FeatureStatus,
} from "../../../domain/entities/feature.entity";



export interface FeatureDocument extends Document {


  key: string;


  label: string;


  description?: string;



  category?: string;



  dataType: FeatureDataType;



  displayOrder?: number;



  status: FeatureStatus;

deletedAt: Date | null;

  createdAt: Date;


  updatedAt: Date;

}



const featureSchema =
  new Schema<FeatureDocument>(

    {


      key: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        lowercase: true,

        minlength: 2,

        maxlength: 50,

      },



      label: {

        type: String,

        required: true,

        trim: true,

        minlength: 2,

        maxlength: 100,

      },



      description: {

        type: String,

        trim: true,

        maxlength: 500,

      },



      category: {

        type: String,

        trim: true,

        maxlength: 50,

        index: true,

      },



      dataType: {

        type: String,

        required: true,

        enum: [
          "boolean",
          "number",
          "string",
          "json",
        ],

      },



      displayOrder: {

        type: Number,

        default: 0,

        min: 0,

      },



      status: {

        type: String,

        enum: [
          "active",
          "inactive",
        ],

        default: "active",

        index: true,

      },


    },

    {

      timestamps: true,

      versionKey: false,

    }

  );



featureSchema.index({
  status: 1,
  category: 1,
});


export const FeatureModel =
  model<FeatureDocument>(
    "Feature",
    featureSchema
  );