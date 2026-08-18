import { User, NewUser } from '../entities/user.entity';
import { PaginatedResult } from '../../shared/utils/pagination';
import { OrganizationStatus } from '../entities/organization.entity';

export interface OrganizationAdminSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface IUserRepository {
  create(data: NewUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, organizationId?: string): Promise<User | null>;
  update(id: string, data: Partial<NewUser>): Promise<User | null>;
  resetPassword(userId: string, passwordHash: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  findOrganizationAdmin(organizationId: string): Promise<OrganizationAdminSummary | null>;

}