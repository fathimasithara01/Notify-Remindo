import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

import {
  PlanFeatureValue,
} from "../../../domain/entities/plan-feature.entity";

export interface PlanFeatureDocument extends Document {
  planId: Types.ObjectId;
  featureId: Types.ObjectId;
  featureValue: PlanFeatureValue;
  deletedAt: Date,
  createdAt: Date;
  updatedAt: Date;
}

const planFeatureSchema =
  new Schema<PlanFeatureDocument>(
    {
      planId: {
        type: Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
        index: true,
      },

      featureId: {

        type: Schema.Types.ObjectId,

        ref: "Feature",

        required: true,

        index: true,

      },
      featureValue: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
    {
      timestamps:true,
      versionKey:false,
    }
  );

// Prevent duplicate feature assignment
planFeatureSchema.index(
  {
    planId:1,
    featureId:1,
  },
  {
    unique:true,
  }
);

// Feature lookup optimization
planFeatureSchema.index({ featureId:1,});

// Sorting/history
planFeatureSchema.index({ createdAt:-1,});

export const PlanFeatureModel =
  model<PlanFeatureDocument>(
    "PlanFeature",
    planFeatureSchema
  );