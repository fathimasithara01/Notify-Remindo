import { Schema, model, Types, Document } from 'mongoose';

export interface SalesmanDocument extends Document {
  userId: Types.ObjectId;
  commissionRate?: number;
  status: 'active' | 'inactive';
}

const salesmanSchema = new Schema<SalesmanDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commissionRate: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

export const SalesmanModel = model<SalesmanDocument>('Salesman', salesmanSchema);