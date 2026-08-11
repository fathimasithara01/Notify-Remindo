import { Schema, model, Document, Types } from 'mongoose';
import { PlatformUserStatus } from '../../../domain/entities/platformUser.entity';

export interface PlatformUserDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roleId: Types.ObjectId;
  status: PlatformUserStatus;
  tokenVersion: number;
  lastLoginAt?: Date;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const platformUserSchema = new Schema<PlatformUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active', index: true },
    mustChangePassword: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const PlatformUserModel = model<PlatformUserDocument>('PlatformUser', platformUserSchema);