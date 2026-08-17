import { Schema, model, Types, Document } from 'mongoose';
import { OrganizationStatus } from '../../../domain/entities/organization.entity';


export interface OrganizationDocument extends Document {
  name: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  status: OrganizationStatus;

  currentPlanId?: Types.ObjectId | null;
  currentPlanName: string | null;

  salesmanId?: Types.ObjectId | null;

  preBlockStatus?: OrganizationStatus | null;  

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, trim: true },
    businessEmail: { type: String, required: true, lowercase: true, trim: true },
    businessPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'active', 'blocked', 'expired'], default: 'active' },
    currentPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      default: null,
    },
    currentPlanName: { type: String, default: null },
    salesmanId: { type: Schema.Types.ObjectId, ref: 'Salesman', default: null },

    preBlockStatus: {                                                 // ← add this
      type: String,
      enum: ['pending', 'active', 'blocked', 'expired'],
      default: null,
    },

    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

organizationSchema.index({ businessEmail: 1 }, { unique: true });
export const OrganizationModel = model<OrganizationDocument>('Organization', organizationSchema);