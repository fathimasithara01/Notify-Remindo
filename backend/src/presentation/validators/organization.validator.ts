import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const emailSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .email('Enter a valid email address')
    .toLowerCase();

const phoneSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .regex(/^[0-9+\-\s()]{10,15}$/, 'Enter a valid phone number');

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Organization name is required'),

    businessEmail: emailSchema('Business email is required'),

    businessPhone: phoneSchema('Business phone is required'),

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

    admin: z.object({
      firstName: z
        .string()
        .trim()
        .min(1, 'Admin first name is required'),

      lastName: z
        .string()
        .trim()
        .min(1, 'Admin last name is required'),

      email: emailSchema('Admin email is required'),

      phone: phoneSchema('Admin phone is required'),

      password: passwordSchema,
    }),
  })
});

export const editOrganizationSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    businessEmail: emailSchema('Business email is required').optional(),
    businessPhone: z.string().min(1).optional(),
    address: z.string().optional(),
  }),
});

export const editOrganizationAdminSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: emailSchema('Email is required'),
    phone: phoneSchema('Phone is required').optional(),
  }),
});

export const upgradePlanSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    newPlanId: z.string().min(1, 'newPlanId is required'),
  }),
});

export const assignSalesmanSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    salesmanId: z.string().min(1, 'salesmanId is required'),
  }),
});

export const blockCustomerSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    reason: z.string().optional(),
  }),
});

export const addContactPersonSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    firstName: z.string().min(1, 'Admin first name is required'),
    lastName: z.string().min(1, 'Admin last name is required'),
    designation: z.string().optional(),
    phone: z.string().optional(),
    email: emailSchema('Email is required').optional(),
  }),
});

export const editContactPersonSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    contactId: z.string().min(1),
  }),
  body: z.object({
    firstName: z.string().min(1, 'Admin first name is required'),
    lastName: z.string().min(1, 'Admin last name is required'),
    designation: z.string().optional(),
    phone: z.string().optional(),
    email: emailSchema('Email is required').optional(),
  }),
});

export const resetOrganizationAdminPasswordSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    password: passwordSchema,
  }),
});