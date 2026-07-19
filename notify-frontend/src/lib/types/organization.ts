export type OrganizationStatus = 'active' | 'blocked';

export interface Organization {
  id: string;
  name: string;
  businessDetails?: Record<string, unknown>;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: OrganizationStatus;
  currentPlanId: string;
  salesmanId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPerson {
  id: string;
  organizationId: string;
  name: string;
  designation?: string;
  phone?: string;
  email?: string;
}

export interface CreateOrganizationPayload {
  name: string;
  businessDetails?: Record<string, unknown>;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  planId: string;
  salesmanId?: string;
}

export interface EditOrganizationPayload {
  name?: string;
  businessDetails?: Record<string, unknown>;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface OrganizationListFilter {
  status?: OrganizationStatus;
  planId?: string;
  page?: number;
  limit?: number;
}