import { Schema, model, Document, Types } from 'mongoose';

export interface OrganizationDocumentDocument extends Document {
  organizationId: Types.ObjectId;

  fileName: string;
  fileUrl: string;
  fileKey: string;

  mimeType: string;
  fileSize: number;

  uploadedBy: Types.ObjectId;

  uploadedAt: Date;
  updatedAt: Date;

  deletedAt: Date | null;
}

const organizationDocumentSchema =
  new Schema<OrganizationDocumentDocument>(
    {
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true,
      },

      fileName: {
        type: String,
        required: true,
        trim: true,
      },

      fileUrl: {
        type: String,
        required: true,
        trim: true,
      },

      fileKey: {
        type: String,
        required: true,
        trim: true,
      },

      mimeType: {
        type: String,
        required: true,
        trim: true,
      },

      fileSize: {
        type: Number,
        required: true,
        min: 0,
      },

      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },

      deletedAt: {
        type: Date,
        default: null,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

organizationDocumentSchema.index({
  organizationId: 1,
  deletedAt: 1,
});

export const OrganizationDocumentModel =
  model<OrganizationDocumentDocument>(
    'OrganizationDocument',
    organizationDocumentSchema
  );