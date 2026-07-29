import { Schema, model, Types, Document } from 'mongoose';

export interface OrganizationFile {
  fileName: string;
  fileUrl: string;
  fileKey?: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface OrganizationDocument extends Document {
  name: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  status: 'active' | 'blocked';

  currentPlanId?: Types.ObjectId | null;
  salesmanId?: Types.ObjectId | null;

  documents?: OrganizationFile[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const organizationFileSchema = new Schema<OrganizationFile>(
  {
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
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, trim: true },
    businessEmail: { type: String, required: true, lowercase: true, trim: true },
    businessPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },

    currentPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      default: null,
    },
    salesmanId: { type: Schema.Types.ObjectId, ref: 'Salesman', default: null },

    documents: { type: [organizationFileSchema], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const OrganizationModel = model<OrganizationDocument>('Organization', organizationSchema);


// fileName → file name kaanikkaan
// fileUrl → file view/download cheyyan
// fileKey → S3/Cloudinary-il file delete/manage cheyyan useful
// mimeType → PDF, JPG, PNG enn identify cheyyan
// fileSize → file size kaanikkaan / validation
// uploadedAt → eppol upload cheythu enn ariyaan