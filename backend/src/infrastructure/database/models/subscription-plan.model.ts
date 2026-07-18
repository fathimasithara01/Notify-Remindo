import { Schema, model, Document } from 'mongoose';

export interface SubscriptionPlanDocument extends Document {
  name: string;
  userLimit: number;
  durationDays: number;
  price: number;
  status: 'active' | 'inactive';
  description?: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userLimit: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>(
  'SubscriptionPlan',
  subscriptionPlanSchema
);