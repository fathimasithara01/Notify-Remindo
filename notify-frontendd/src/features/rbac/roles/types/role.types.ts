export type RoleStatus = 'active' | 'inactive';
export type Permission = string;

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissionIds: Permission[];
  isSystem: boolean;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  status?: RoleStatus;
  permissionIds?: Permission[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  status?: RoleStatus;
  permissionIds?: Permission[];
}

export interface RoleFilters {
  search?: string;
  status?: RoleStatus | 'all';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}