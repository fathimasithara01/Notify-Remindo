import { User, NewUser } from '../entities/user.entity';

export interface IUserRepository {
  create(data: NewUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByInviteToken(token: string): Promise<User | null>;
  update(id: string, data: Partial<NewUser>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: {
    status?: 'invited' | 'active' | 'inactive';
    roleId?: string;
    organizationId?: string;
  }): Promise<User[]>;
}