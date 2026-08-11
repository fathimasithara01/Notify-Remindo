import { Schema, model, Document, Types } from 'mongoose';
import { RoleStatus } from '../../../domain/entities/role.entity';

export interface RoleDocument extends Document {
  name: string;
  description?: string;
  organizationId?: Types.ObjectId;
  permissionIds: string[];
  isSystem: boolean;
  status: RoleStatus;
  createdBy: string;
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
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    permissionIds: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    createdBy: { type: String, required: true },
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