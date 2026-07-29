export type OrganizationStatus = 'active' | 'blocked';

export type OrganizationAdminStatus = 'active' | 'invited' | 'inactive';

export interface OrganizationDocument {
  fileName: string;
  fileUrl: string;
  fileKey?: string;
  mimeType: string;
  fileSize: number;
  uploadedAt?: string;
}

export interface OrganizationAdmin {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: OrganizationAdminStatus;
}

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

  /**
 * Primary Organization Admin. Can be null if the organization currently has no active/invited Organization Admin.
 */
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

  documents?: OrganizationDocument[];

  /**
   * Initial Organization Admin. This user receives the invitation email and becomes the Organization Admin.
   */
  admin: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface EditOrganizationPayload {
  name?: string;
  businessEmail?: string;
  businessPhone?: string;
  address?: string;
  documents?: OrganizationDocument[];
}

export interface OrganizationListFilters {
  status?: OrganizationStatus;
  salesmanId?: string;
  planId?: string;
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

export interface ContactPerson {
  id: string;
  organizationId: string;
  name: string;
  designation?: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}