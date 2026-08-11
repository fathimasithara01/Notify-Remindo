import { User, NewUser, UserStatus } from '../entities/user.entity';
import { PaginatedResult } from '../../shared/utils/pagination';

export interface OrganizationAdminSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
}

export interface IUserRepository {
  create(data: NewUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, organizationId: string): Promise<User | null>;
  update(id: string, data: Partial<NewUser>): Promise<User | null>;
  resetPassword(userId: string, passwordHash: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  list(filter?: {
    status?: UserStatus;
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>>;

  assignRole(userId: string, roleId: string): Promise<void>;

  findOrganizationAdmin(organizationId: string): Promise<OrganizationAdminSummary | null>;
  findOneByOrganizationAndStatus(organizationId: string, status: UserStatus): Promise<User | null>;

  cancelInvite(userId: string): Promise<boolean>;
  countByRoleId(roleId: string): Promise<number>;
}