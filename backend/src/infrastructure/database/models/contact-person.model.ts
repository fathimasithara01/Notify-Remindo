// import { Schema, model, Types, Document } from 'mongoose';

// export interface ContactPersonDocument extends Document {
//   organizationId: Types.ObjectId;
//   name: string;
//   designation?: string;
//   contactPhone?: string;
//   contactEmail?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const contactPersonSchema = new Schema<ContactPersonDocument>(
//   {
//     organizationId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Organization',
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     designation: {
//       type: String,
//       trim: true,
//     },
//     contactPhone: {
//       type: String,
//       trim: true,
//     },
//     contactEmail: {
//       type: String,
//       lowercase: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// export const ContactPersonModel = model<ContactPersonDocument>(
//   'ContactPerson',
//   contactPersonSchema
// );