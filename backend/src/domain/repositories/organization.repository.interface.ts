import { Organization, OrganizationStatus, NewOrganization,OrganizationWithAdmin, OrganizationDetails } from '../entities/organization.entity';
import { ContactPerson, NewContactPerson } from '../entities/contact-person.entity';

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
  findById(id: string): Promise<OrganizationDetails | null>;
  update(id: string, data: Partial<NewOrganization>): Promise<Organization | null>;
  delete(id: string): Promise<boolean>;
  list( filters?: OrganizationListFilters): Promise<OrganizationListResult>;

  block(id: string): Promise<Organization | null>;
  unblock(id: string): Promise<Organization | null>;
  assignSalesman(id: string, salesmanId: string): Promise<Organization | null>;
  changePlan(id: string, planId: string): Promise<Organization | null>;

  // addContactPerson(organizationId: string, data: NewContactPerson): Promise<ContactPerson>;
  // listContactPersons(organizationId: string): Promise<ContactPerson[]>;
  // getContactPerson(organizationId: string, contactPersonId: string): Promise<ContactPerson | null>;
  // updateContactPerson(organizationId: string,contactPersonId: string,data: Partial<NewContactPerson>): Promise<ContactPerson | null>;
  // removeContactPerson(organizationId: string, contactPersonId: string): Promise<boolean>;
}