import { Schema, model, Types, Document } from 'mongoose';

export interface AuditLogDocument extends Document {
  adminId: Types.ObjectId;
  action: string;
  targetType: 'Organization' | 'SubscriptionPlan' | 'Role' | 'User';
  targetId: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      required: true,
      trim: true,
      enum: ['Organization', 'SubscriptionPlan', 'Role', 'User'],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLogModel = model<AuditLogDocument>('AuditLog', auditLogSchema);