import { Schema, model, Types, Document } from 'mongoose';

export interface OrganizationSubscriptionDocument extends Document {
  organizationId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'upgraded' | 'expired' | 'cancelled';
  createdAt: Date;
}

const organizationSubscriptionSchema = new Schema<OrganizationSubscriptionDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'upgraded', 'expired', 'cancelled'],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OrganizationSubscriptionModel = model<OrganizationSubscriptionDocument>(
  'OrganizationSubscription',
  organizationSubscriptionSchema
);