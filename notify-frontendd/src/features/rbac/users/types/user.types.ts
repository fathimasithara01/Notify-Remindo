
export type UserStatus = 'invited' | 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
firstName: string;
  lastName: string;
    email: string;
  phone?: string;
  status: UserStatus;
  roleId: string;
  organizationId: string;
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
  inviteUrl: string;
  emailSent: boolean;
}

export interface UpdateUserDto {
firstName?: string;
  lastName?: string;  
  phone?: string;
  status?: UserStatus;
  roleId?: string;  
}

export interface UserFilters {
  search?: string;
  status?: UserStatus | 'all';
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

export interface UserRole {
  id: string;
firstName: string;
  lastName: string;}

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