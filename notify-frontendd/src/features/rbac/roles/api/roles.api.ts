import { toQueryParams } from '../../shared/query-params';
import type {
  AddPermissionDto,
  CreateRoleDto,
  PaginatedResult,
  Role,
  RoleFilters,
  RolePermission,
  UpdateRoleDto,
} from '../types/role.types';
import { apiClient } from '@/lib/api/client';

const BASE_URL = '/roles';

export const rolesApi = {
  list: (filters: RoleFilters): Promise<PaginatedResult<Role>> =>
    apiClient.get<PaginatedResult<Role>>(BASE_URL, toQueryParams(filters)),

  getOne: (id: string): Promise<Role> =>
    apiClient.get<Role>(`${BASE_URL}/${id}`),

  create: (payload: CreateRoleDto): Promise<Role> =>
    apiClient.post<Role>(BASE_URL, payload),

  update: (id: string, payload: UpdateRoleDto): Promise<Role> =>
    apiClient.patch<Role>(`${BASE_URL}/${id}`, payload),

  delete: (id: string): Promise<null> =>
    apiClient.delete<null>(`${BASE_URL}/${id}`),

  getPermissions: (id: string): Promise<RolePermission[]> =>
    apiClient.get<RolePermission[]>(`${BASE_URL}/${id}/permissions`),

  addPermission: (id: string, payload: AddPermissionDto): Promise<RolePermission> =>
    apiClient.post<RolePermission>(`${BASE_URL}/${id}/permissions`, payload),

  removePermission: (id: string, permissionId: string): Promise<null> =>
    apiClient.delete<null>(`${BASE_URL}/${id}/permissions/${permissionId}`),
};