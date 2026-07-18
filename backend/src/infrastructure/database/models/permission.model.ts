import { Schema, model, Document } from 'mongoose';

export interface PermissionDocument extends Document {
  name: string;
  module: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<PermissionDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const PermissionModel = model<PermissionDocument>('Permission', permissionSchema);