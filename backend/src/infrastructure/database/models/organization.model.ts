import { Schema, model, Types, Document } from 'mongoose';

export interface OrganizationDocument extends Document {
  name: string;
  businessDetails?: Record<string, unknown>;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: 'active' | 'blocked';
  currentPlanId: Types.ObjectId;
  salesmanId?: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessDetails: {
      type: Schema.Types.Mixed,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    currentPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    salesmanId: {
      type: Schema.Types.ObjectId,
      ref: 'Salesman',
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const OrganizationModel = model<OrganizationDocument>('Organization', organizationSchema);