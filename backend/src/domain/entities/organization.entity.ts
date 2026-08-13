export type OrganizationStatus = 'pending' | 'active' |  'blocked' | 'expired';

export interface Organization {
  id: string;
  name: string;

  businessEmail: string;
  businessPhone: string;
  address: string;

  status: OrganizationStatus;

  currentPlanId?: string | null;
  salesmanId?: string | null;

  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationAdminSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface OrganizationWithAdmin extends Organization {
  currentPlanName: string | null;
  admin: OrganizationAdminSummary | null;
}

export type NewOrganization = Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: OrganizationStatus;
};