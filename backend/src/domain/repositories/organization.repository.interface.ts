import { Organization, NewOrganization } from '../entities/organization.entity';
import { ContactPerson, NewContactPerson } from '../entities/contact-person.entity';

export interface IOrganizationRepository {
  create(data: NewOrganization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  update(id: string, data: Partial<NewOrganization>): Promise<Organization | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: {
    status?: 'active' | 'blocked';
    salesmanId?: string;
    planId?: string;
  }): Promise<Organization[]>;

  block(id: string): Promise<Organization | null>;
  unblock(id: string): Promise<Organization | null>;
  assignSalesman(id: string, salesmanId: string): Promise<Organization | null>;
  changePlan(id: string, planId: string): Promise<Organization | null>;

  addContactPerson(organizationId: string, data: NewContactPerson): Promise<ContactPerson>;
  listContactPersons(organizationId: string): Promise<ContactPerson[]>;
  removeContactPerson(contactPersonId: string): Promise<boolean>;
}