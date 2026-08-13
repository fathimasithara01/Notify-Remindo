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
  findByEmail(email: string, organizationId: string): Promise<User | null>;
  update(id: string, data: Partial<NewUser>): Promise<User | null>;
  resetPassword(userId: string, passwordHash: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  list(filter?: {
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>>;

  assignRole(userId: string, roleId: string): Promise<void>;

  findOrganizationAdmin(organizationId: string): Promise<OrganizationAdminSummary | null>;
  findOneByOrganizationAndStatus(organizationId: string, status: OrganizationStatus): Promise<User | null>;

  cancelInvite(userId: string): Promise<boolean>;
  countByRoleId(roleId: string): Promise<number>;
}