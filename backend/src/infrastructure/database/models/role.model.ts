import { Schema, model, Document } from 'mongoose';

export interface RoleDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  status: 'active' | 'inactive';
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const RoleModel = model<RoleDocument>('Role', roleSchema);