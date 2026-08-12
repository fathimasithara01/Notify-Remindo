import { Document, Schema, model } from "mongoose";
import { FeatureStatus } from "../../../domain/entities/feature.entity";

export interface FeatureDocument extends Document {
  title: string;
  description?: string;
  category?: string;
  status: FeatureStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<FeatureDocument>(
  {
    title: {
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
    status: {
      type: String,
      enum: Object.values(FeatureStatus),
      default: FeatureStatus.ACTIVE,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

featureSchema.index({ status: 1, category: 1 });

export const FeatureModel = model<FeatureDocument>("Feature", featureSchema);