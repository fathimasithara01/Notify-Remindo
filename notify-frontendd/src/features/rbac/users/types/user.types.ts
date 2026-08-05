export type UserStatus = 'invited' | 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  organizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

/** Fields the create form sends. Backend generates an invite token + sends invite email. */
export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  organizationId?: string;
  roleIds?: string[];
}

/** Fields the edit form can update. Status/email changes may be restricted server-side. */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string | null;
  status?: UserStatus;
}

export interface AssignRoleDto {
  roleId: string;
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

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}