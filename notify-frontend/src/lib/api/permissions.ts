
import { apiClient } from './client';
import { Permission, CreatePermissionPayload } from '../types/permission';
import { PaginatedResponse } from '../types/pagination';

export const permissionApi = {
  list: (module?: string, page = 1, limit = 100) =>
    apiClient.get<PaginatedResponse<Permission>>('/permissions', {
      module,
      page: page.toString(),
      limit: limit.toString(),
    }),

  create: (payload: CreatePermissionPayload) =>
    apiClient.post<Permission>('/permissions', payload),

  update: (id: string, payload: Partial<CreatePermissionPayload>) =>
    apiClient.patch<Permission>(`/permissions/${id}`, payload),

  delete: (id: string) => apiClient.delete<null>(`/permissions/${id}`),
};