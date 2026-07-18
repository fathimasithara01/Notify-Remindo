import { Schema, model, Types, Document } from 'mongoose';

export interface PlanFeatureDocument extends Document {
  planId: Types.ObjectId;
  featureId: Types.ObjectId;
  featureValue: string | boolean | number;
  createdAt: Date;
  updatedAt: Date;
}

const planFeatureSchema = new Schema<PlanFeatureDocument>(
  {
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    featureId: {
      type: Schema.Types.ObjectId,
      ref: 'Feature',
      required: true,
    },
    featureValue: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate feature entries for the same plan
planFeatureSchema.index({ planId: 1, featureId: 1 }, { unique: true });

export const PlanFeatureModel = model<PlanFeatureDocument>('PlanFeature', planFeatureSchema);