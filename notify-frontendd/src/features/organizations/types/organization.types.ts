export type OrganizationStatus = 'pending' | 'created' | 'active' |  'blocked' | 'expired';

export interface OrganizationAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface Organization {
  id: string;
  name: string;

  businessEmail: string;
  businessPhone: string;
  address: string;

  status: OrganizationStatus;

  currentPlanId?: string | null;
  currentPlanName: string | null;
  salesmanId?: string | null;

  admin: OrganizationAdmin | null;

  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationPayload {
  name: string;

  businessEmail: string;
  businessPhone: string;
  address: string;

  planId?: string;
  salesmanId?: string;

  admin: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  };
}

export interface EditOrganizationPayload {
  name?: string;
  businessEmail?: string;
  businessPhone?: string;
  address?: string;
}

export interface EditOrganizationAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface OrganizationListFilters {
  status?: OrganizationStatus;
  salesmanId?: string;
  currentPlanId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrganizationListResponse {
  items: Organization[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResetAdminPasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}