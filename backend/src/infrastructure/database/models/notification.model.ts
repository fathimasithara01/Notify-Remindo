import { Schema, model, Types, Document } from 'mongoose';

export interface NotificationDocument extends Document {
  organizationId: Types.ObjectId;
  referenceType: 'PDC_ISSUED' | 'PDC_RECEIVED' | 'HR_DOC';
  referenceId: Types.ObjectId;
  notifyBefore: number;
  mode: 'whatsapp' | 'email';
  status: 'pending' | 'sent' | 'failed';
  scheduledAt: Date;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    referenceType: {
      type: String,
      required: true,
      enum: ['PDC_ISSUED', 'PDC_RECEIVED', 'HR_DOC'],
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'referenceType',
    },
    notifyBefore: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ['whatsapp', 'email', 'in_app'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const NotificationModel = model<NotificationDocument>('Notification', notificationSchema);