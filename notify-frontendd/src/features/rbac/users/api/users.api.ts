import { toQueryParams } from '../../shared/query-params';
import type {
    AssignRoleDto,
    CreateUserDto,
    CreateUserResponse,
    PaginatedResult,
    UpdateUserDto,
    User,
    UserFilters,
    UserRole,
} from '../types/user.types';
import { apiClient } from '@/lib/api/client';

const BASE_URL = '/users';

export const usersApi = {
    list: (filters: UserFilters): Promise<PaginatedResult<User>> =>
        apiClient.get<PaginatedResult<User>>(BASE_URL, toQueryParams(filters)),

    getOne: (id: string): Promise<User> =>
        apiClient.get<User>(`${BASE_URL}/${id}`),

    create: (payload: CreateUserDto): Promise<CreateUserResponse> =>
        apiClient.post<CreateUserResponse>(BASE_URL, payload),

    update: (id: string, payload: UpdateUserDto): Promise<User> =>
        apiClient.patch<User>(`${BASE_URL}/${id}`, payload),

    delete: (id: string): Promise<null> =>
        apiClient.delete<null>(`${BASE_URL}/${id}`),

    revokeSessions: (id: string): Promise<null> =>
        apiClient.post<null>(`${BASE_URL}/${id}/revoke-sessions`),

    getRoles: (id: string): Promise<UserRole[]> =>
        apiClient.get<UserRole[]>(`${BASE_URL}/${id}/roles`),

    assignRole: (id: string, payload: AssignRoleDto): Promise<UserRole[]> =>
        apiClient.post<UserRole[]>(`${BASE_URL}/${id}/roles`, payload),

    removeRole: (id: string, roleId: string): Promise<UserRole[]> =>
        apiClient.delete<UserRole[]>(`${BASE_URL}/${id}/roles/${roleId}`),
};