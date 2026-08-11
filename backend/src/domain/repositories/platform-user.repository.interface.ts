import { PlatformUser, NewPlatformUser, PlatformUserStatus } from '../entities/platformUser.entity';
import { PaginatedResult } from '../../shared/utils/pagination';

export interface IPlatformUserRepository {
  create(data: NewPlatformUser): Promise<PlatformUser>;
  findById(id: string): Promise<PlatformUser | null>;
  findByEmail(email: string): Promise<PlatformUser | null>;
  update(id: string, data: Partial<NewPlatformUser>): Promise<PlatformUser | null>;
  resetPassword(userId: string, passwordHash: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  list(filter: {
    status?: PlatformUserStatus;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<PlatformUser>>;

  assignRole(userId: string, roleId: string): Promise<void>;
  countByRoleId(roleId: string): Promise<number>;
    findByInviteToken(token: string): Promise<PlatformUser | null>;
    findByResetPasswordToken(token: string): Promise<PlatformUser | null>;
}