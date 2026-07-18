import { Schema, model, Document } from 'mongoose';

export interface FeatureDocument extends Document {
  key: string;
  label: string;
  dataType: 'boolean' | 'number' | 'string';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<FeatureDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    dataType: {
      type: String,
      enum: ['boolean', 'number', 'string'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const FeatureModel = model<FeatureDocument>('Feature', featureSchema);