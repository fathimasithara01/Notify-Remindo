import { z } from 'zod';

const organizationFileSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  fileKey: z.string().optional(),
  mimeType: z.string().min(1, 'MIME type is required'),
  fileSize: z.number().positive('File size must be greater than 0'),
  uploadedAt: z.coerce.date().optional(),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  businessEmail: z.string().email('Invalid business email'),
  businessPhone: z.string().min(1, 'Business phone is required'),
  address: z.string().min(1, 'Address is required'),

  planId: z.string().optional(),
  salesmanId: z.string().optional(),

  documents: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string().url(),
        fileKey: z.string(),
        mimeType: z.string(),
        fileSize: z.number(),
        uploadedAt: z.coerce.date().optional(),
      })
    ).optional(),

  admin: z.object({
    name: z.string().min(1, 'Admin name is required'),
    email: z.string().email('Invalid admin email'),
    phone: z.string().optional(),
  }),
})

export const editOrganizationSchema = z.object({
  name: z.string().min(1).optional(),

  businessEmail: z.string().email().optional(),
  businessPhone: z.string().min(1).optional(),
  address: z.string().optional(),

  documents: z.array(organizationFileSchema).optional(),
});

export const upgradePlanSchema = z.object({
  newPlanId: z.string().min(1, 'newPlanId is required'),
});

export const assignSalesmanSchema = z.object({
  salesmanId: z.string().min(1, 'salesmanId is required'),
});

export const blockCustomerSchema = z.object({
  reason: z.string().optional(),
});

export const addContactPersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const editContactPersonSchema = z.object({
  name: z.string().min(1).optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});