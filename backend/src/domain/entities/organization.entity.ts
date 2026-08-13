export type OrganizationStatus = 'active' | 'blocked';

export interface Organization {
  id: string;
  name: string;

  businessEmail: string;
  businessPhone: string;
  address: string;

  status: OrganizationStatus;

  currentPlanId?: string | null;
  salesmanId?: string | null;
  documents?: {
    fileName: string;
    fileUrl: string;
    fileKey: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: Date;
  }[];
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
  status: 'active' | 'invited' | 'inactive';
}

export interface OrganizationDetails extends Organization {
  admin: OrganizationAdminSummary | null;
}

export interface OrganizationWithAdmin extends Organization {
  admin: OrganizationAdminSummary | null;
}

export type NewOrganization = Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: OrganizationStatus;
};