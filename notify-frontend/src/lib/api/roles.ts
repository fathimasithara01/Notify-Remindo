import { apiClient } from './client';
import { Role, RoleWithPermissions, CreateRolePayload, EditRolePayload } from '../types/roles';

export const roleApi = {
    list: () => apiClient.get<Role[]>('/roles'),

    getOne: (id: string) => apiClient.get<RoleWithPermissions>(`/roles/${id}`),

    create: (payload: CreateRolePayload) => apiClient.post<Role>('/roles', payload),

    update: (id: string, payload: EditRolePayload) =>
        apiClient.patch<Role>(`/roles/${id}`, payload),

    assignPermissions: (id: string, permissionIds: string[]) =>
        apiClient.post<RoleWithPermissions>(`/roles/${id}/permissions`, { permissionIds }),
};