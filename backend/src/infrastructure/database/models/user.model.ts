import { Schema, model, Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  organizationId: Types.ObjectId;
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  roleId: Types.ObjectId;
  phone: string;
  lastLoginAt?: Date;
  // inviteToken?: string;
  // inviteTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  // mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    phone: { type: String, required: true },
    passwordHash: { type: String },
    // inviteToken: { type: String, index: true, sparse: true },
    // inviteTokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String, index: true, sparse: true },
    resetPasswordTokenExpiresAt: { type: Date },
    lastLoginAt: { type: Date },
    // mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// email unique per organization (multi-tenant — same email across different orgs allowed)
userSchema.index({ organizationId: 1, email: 1 }, { unique: true });
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export const UserModel = model<UserDocument>('User', userSchema);