import { z } from 'zod';

export const createOrganizationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Enter a valid email address'),
    contactPhone: z.string().min(1, 'Contact phone is required'),
    address: z.string().optional(),
    planId: z.string().min(1, 'Select a plan'),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const editOrganizationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    contactEmail: z.string().email('Enter a valid email address'),
    contactPhone: z.string().min(1, 'Contact phone is required'),
    address: z.string().optional(),
});

export type EditOrganizationFormValues = z.infer<typeof editOrganizationSchema>;

export const contactPersonSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    designation: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
});

export type ContactPersonFormValues = z.infer<typeof contactPersonSchema>;