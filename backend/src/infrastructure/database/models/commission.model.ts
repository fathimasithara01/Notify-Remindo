import { Schema, model, Types, Document } from 'mongoose';

export interface CommissionDocument extends Document {
  salesmanId: Types.ObjectId;
  organizationId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid';
}

const commissionSchema = new Schema<CommissionDocument>({
  salesmanId: {
    type: Schema.Types.ObjectId,
    ref: 'Salesman',
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
});

export const CommissionModel = model<CommissionDocument>('Commission', commissionSchema);