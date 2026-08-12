import { PlatformUser, NewPlatformUser, PlatformUserStatus } from '../entities/platformUser.entity';
import { PaginatedResult } from '../../shared/utils/pagination';
import { PlatformUserWithRole } from '../../application/dtos/platform-user.dto';

export interface IPlatformUserRepository {
  create(data: NewPlatformUser): Promise<PlatformUser>;

  /** Raw entity — internal use only (auth, password flows). Never expose directly. */
  findById(id: string): Promise<PlatformUser | null>;

  /** API-facing lookup — role resolved, passwordHash never present. */
  findByIdWithRole(id: string): Promise<PlatformUserWithRole | null>;

  findByEmail(email: string): Promise<PlatformUser | null>;
  update(id: string, data: Partial<NewPlatformUser>): Promise<PlatformUser | null>;
  resetPassword(userId: string, passwordHash: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;

  list(filter: {
    status?: PlatformUserStatus;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<PlatformUserWithRole>>;

  assignRole(userId: string, roleId: string): Promise<void>;
  countByRoleId(roleId: string): Promise<number>;
  findByInviteToken(token: string): Promise<PlatformUser | null>;
  findByResetPasswordToken(token: string): Promise<PlatformUser | null>;
}