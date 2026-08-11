import { Schema, model, Document, Types } from 'mongoose';
import { PlatformUserStatus } from '../../../domain/entities/platformUser.entity';

export interface PlatformUserDocument extends Document {
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  roleId: Types.ObjectId;
  status: PlatformUserStatus;
  tokenVersion: number;
  inviteToken?: string;
  inviteTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  lastLoginAt?: Date;
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const platformUserSchema = new Schema<PlatformUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'PlatformRole', required: true, index: true },
    status: {
      type: String,
      enum: ['invited', 'active', 'inactive', 'suspended'],
      default: 'invited',
      index: true,
    },
    mustChangePassword: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    inviteToken: { type: String, index: true },
    inviteTokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String, index: true },
    resetPasswordTokenExpiresAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const PlatformUserModel = model<PlatformUserDocument>('PlatformUser', platformUserSchema);