import { Schema, model, Types, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string | null;
  status: 'invited' | 'active' | 'inactive';
  organizationId: Types.ObjectId | null;
  inviteToken: string | null;
  inviteTokenExpiresAt: Date | null;
  tokenVersion: number;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiresAt: Date | null;
  mustChangePassword: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: null },
    passwordHash: { type: String, default: null },
    status: { type: String, enum: ['invited', 'active', 'inactive'], default: 'active' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    inviteToken: { type: String, default: null, index: true },
    inviteTokenExpiresAt: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiresAt: { type: Date, default: null },
    mustChangePassword: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);