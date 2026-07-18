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
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewOrganization = Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: OrganizationStatus;
};