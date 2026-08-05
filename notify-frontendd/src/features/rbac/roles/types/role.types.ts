export type RoleStatus = 'active' | 'inactive';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: {
    id: string;
    name: string;
    module: string;
  };
  createdAt: string;
}

/** isSystem is server-controlled — never sent from the client. */
export interface CreateRoleDto {
  name: string;
  slug: string;
  description?: string;
  status?: RoleStatus;
}

export interface UpdateRoleDto {
  name?: string;
  slug?: string;
  description?: string;
  status?: RoleStatus;
}

export interface AddPermissionDto {
  permissionId: string;
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