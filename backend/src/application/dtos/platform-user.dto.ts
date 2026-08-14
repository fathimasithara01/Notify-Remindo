import { PlatformUserStatus } from "../../domain/entities/platformUser.entity";

export interface PlatformUserRoleSummary {
  id: string;
  name: string;
}

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