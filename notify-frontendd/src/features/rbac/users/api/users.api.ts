import { toQueryParams } from '../../shared/query-params';
import type {
    CreateUserDto,
    CreateUserResponse,
    PaginatedResult,
    UpdateUserDto,
    User,
    UserFilters,
    ResendInviteResponse,
    RequestPasswordResetResponse,
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

    resendInvite: (id: string): Promise<ResendInviteResponse> =>
        apiClient.post<ResendInviteResponse>(`${BASE_URL}/${id}/resend-invite`),

    requestPasswordReset: (id: string): Promise<RequestPasswordResetResponse> =>
        apiClient.post<RequestPasswordResetResponse>(`${BASE_URL}/${id}/request-password-reset`),

    delete: (id: string): Promise<null> =>
        apiClient.delete<null>(`${BASE_URL}/${id}`),

    revokeSessions: (id: string): Promise<{ message: string }> =>
        apiClient.post(`${BASE_URL}/${id}/revoke-sessions`),
};