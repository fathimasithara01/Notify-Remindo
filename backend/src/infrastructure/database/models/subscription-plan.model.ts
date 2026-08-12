import { Document, Schema, model } from "mongoose";
import {
  SubscriptionPlanStatus,
  Currency,
} from "../../../domain/entities/subscription-plan.entity";

export interface SubscriptionPlanDocument extends Document {
  title: string;
  description?: string;
  amountValue: number;
  currency: Currency;
  userLimit: number;
  storageLimit: number;
  featureIds: string[];
  status: SubscriptionPlanStatus;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
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
    amountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["USD", "EUR", "INR"],
      default: "INR",
    },
    userLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    storageLimit: {
      type: Number,
      required: true,
      min: 0,
    },
    featureIds: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionPlanStatus),
      default: SubscriptionPlanStatus.ACTIVE,
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

subscriptionPlanSchema.index({ title: 1, deletedAt: 1 });
subscriptionPlanSchema.index({ status: 1, deletedAt: 1 });

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);