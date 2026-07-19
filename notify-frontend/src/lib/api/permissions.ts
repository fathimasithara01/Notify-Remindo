import { apiClient } from './client';
import { Permission, CreatePermissionPayload } from '../types/permission';

export const permissionApi = {
    list: (module?: string) => apiClient.get<Permission[]>('/permissions', { module }),

    create: (payload: CreatePermissionPayload) => apiClient.post<Permission>('/permissions', payload),
};