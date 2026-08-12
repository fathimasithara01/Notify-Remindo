import { PlatformUserStatus } from "../../domain/entities/platformUser.entity";

export interface PlatformUserRoleSummary {
  id: string;
  name: string;
}

/** Public-facing user shape: never carries passwordHash, always carries a
 * resolved role (or null if the role was deleted / not populated). */
export interface PlatformUserWithRole {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  role: PlatformUserRoleSummary | null;
  phone?: string;
  status: PlatformUserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}