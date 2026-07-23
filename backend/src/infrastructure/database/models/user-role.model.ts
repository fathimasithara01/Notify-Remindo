import { Schema, model, Types, Document } from 'mongoose';

export interface UserRoleDocument extends Document {
  userId: Types.ObjectId;
  roleId: Types.ObjectId;
  createdAt: Date;
}

const userRoleSchema = new Schema<UserRoleDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

userRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export const UserRoleModel = model<UserRoleDocument>('UserRole', userRoleSchema);