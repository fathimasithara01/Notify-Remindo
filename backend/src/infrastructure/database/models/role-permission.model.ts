import { Schema, model, Types, Document } from 'mongoose';

export interface RolePermissionDocument extends Document {
  roleId: Types.ObjectId;
  permissionId: Types.ObjectId;
  createdAt: Date;
}

const rolePermissionSchema = new Schema<RolePermissionDocument>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

rolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

export const RolePermissionModel = model<RolePermissionDocument>(
  'RolePermission',
  rolePermissionSchema
);