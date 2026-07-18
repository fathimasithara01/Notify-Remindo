import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  businessDetails: z.record(z.string(), z.unknown()).optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().optional(),
  planId: z.string().min(1, 'planId is required'),
  salesmanId: z.string().optional(),
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