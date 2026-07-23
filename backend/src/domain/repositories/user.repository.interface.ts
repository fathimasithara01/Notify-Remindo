import { User, NewUser } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export interface IUserRepository {
  create(data: NewUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByInviteToken(token: string): Promise<User | null>;
  update(id: string, data: Partial<NewUser>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: {
    status?: 'invited' | 'active' | 'inactive';
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
  }): Promise<User[]>;

  listRoles(userId: string): Promise<Role[]>;
  assignRole(userId: string, roleId: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
}