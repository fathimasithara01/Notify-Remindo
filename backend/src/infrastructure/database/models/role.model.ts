import { Schema, model, Document, Types } from 'mongoose';
import { RoleStatus } from '../../../domain/entities/role.entity';

export interface RoleDocument extends Document {
  name: string;
  description?: string;
  permissionIds: string[];
  isSystem: boolean;
  status: RoleStatus;
  createdBy: Types.ObjectId;
  deletion: {
    isDeleted: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    permissionIds: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'PlatformUser', required: true },
    deletion: {
      isDeleted: { type: Boolean, default: false, index: true },
      deletedBy: { type: String },
      deletedAt: { type: Date },
    },
  },
  { timestamps: true }
);

roleSchema.index(
  { organizationId: 1, name: 1 },
  { unique: true, partialFilterExpression: { 'deletion.isDeleted': false } }
);
roleSchema.index({ name: 'text', description: 'text' });

export const RoleModel = model<RoleDocument>('Role', roleSchema);