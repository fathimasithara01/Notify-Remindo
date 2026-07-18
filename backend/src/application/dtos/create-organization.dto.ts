export interface CreateOrganizationDto {
  name: string;
  businessDetails?: Record<string, unknown>;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  planId: string;
  salesmanId?: string;
}