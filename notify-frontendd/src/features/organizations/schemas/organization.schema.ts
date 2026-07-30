import { z } from 'zod';

export const createOrganizationSchema = z.object({
    name: z.string().trim().min(1, 'Organization name is required'),

    businessEmail: z.string().trim().email('Enter a valid business email address'),
    businessPhone: z.string().trim().min(1, 'Business phone is required'),

    address: z
        .string()
        .trim()
        .min(1, 'Address is required'),

    planId: z
        .string()
        .trim()
        .optional(),

    salesmanId: z
        .string()
        .trim()
        .optional(),

    // Initial Organization Admin

    // This user will:
    // - receive the invitation email
    // - accept the invitation
    // - set their password
    // - login as Organization Admin

    admin: z.object({
        name: z
            .string()
            .trim()
            .min(1, 'Admin name is required'),

        email: z
            .string()
            .trim()
            .email('Enter a valid admin email address'),

        phone: z
            .string()
            .trim()
            .optional(),
    }),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const editOrganizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Organization name is required'),

    businessEmail: z
        .string()
        .trim()
        .email('Enter a valid business email address')
        .optional(),

    businessPhone: z
        .string()
        .trim()
        .min(1, 'Business phone is required')
        .optional(),

    address: z
        .string()
        .trim()
        .optional(),
});

export type EditOrganizationFormValues = z.infer<typeof editOrganizationSchema>;

export const contactPersonSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required'),

    designation: z
        .string()
        .trim()
        .optional(),

    contactPhone: z
        .string()
        .optional(),

    contactEmail: z
        .string()
        .email('Enter a valid email address')
        .optional()
        .or(z.literal('')),
});

export type ContactPersonFormValues = z.infer<typeof contactPersonSchema>;