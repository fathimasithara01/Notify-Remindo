import { apiClient } from './client';
import { Role, RoleWithPermissions, CreateRolePayload, EditRolePayload } from '../types/roles';
import { PaginatedResponse } from '../types/pagination';

export const roleApi = {
  list: (page = 1, limit = 20) =>
    apiClient.get<PaginatedResponse<Role>>('/roles', {
      page: page.toString(),
      limit: limit.toString(),
    }),

  getOne: (id: string) => apiClient.get<RoleWithPermissions>(`/roles/${id}`),

  create: (payload: CreateRolePayload) => apiClient.post<Role>('/roles', payload),

  update: (id: string, payload: EditRolePayload) =>
    apiClient.patch<Role>(`/roles/${id}`, payload),

  delete: (id: string) => apiClient.delete<null>(`/roles/${id}`),

  assignPermissions: (id: string, permissionIds: string[]) =>
    apiClient.post<RoleWithPermissions>(`/roles/${id}/permissions`, { permissionIds }),
};