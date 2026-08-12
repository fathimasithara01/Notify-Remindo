export type PlatformUserStatus = 'invited' | 'active' | 'inactive' | 'suspended';

export interface UserRoleSummary {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: PlatformUserStatus;
  roleId: string;
  role: UserRoleSummary | null;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
}

export interface CreateUserResponse extends User {
  emailSent: boolean;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: PlatformUserStatus;
  roleId?: string;
}

export interface UserFilters {
  search?: string;
  status?: PlatformUserStatus | 'all';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AssignRoleDto {
  roleId: string;
}

export interface ResendInviteResponse {
  inviteUrl: string;
  emailSent: boolean;
}

export interface RequestPasswordResetResponse {
  resetUrl: string;
  emailSent: boolean;
}