import { Organization, OrganizationStatus, NewOrganization, OrganizationWithAdmin } from '../entities/organization.entity';

export interface OrganizationListFilters {
  status?: OrganizationStatus;
  planId?: string;
  salesmanId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrganizationListResult {
  items: OrganizationWithAdmin[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IOrganizationRepository {
  create(data: NewOrganization): Promise<Organization>;
  findById(id: string): Promise<OrganizationWithAdmin | null>;
  findByBusinessEmail(email: string): Promise<Organization | null>;
  update(id: string, data: Partial<NewOrganization>): Promise<Organization | null>;
  delete(id: string): Promise<boolean>;
  list(filters?: OrganizationListFilters): Promise<OrganizationListResult>;

  block(id: string): Promise<Organization | null>;
  unblock(id: string): Promise<Organization | null>;
  assignSalesman(id: string, salesmanId: string): Promise<Organization | null>;
  changePlan(id: string, planId: string): Promise<Organization | null>;
}