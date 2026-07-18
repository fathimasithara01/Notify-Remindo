import { apiClient } from './client';
import { AuthUser, LoginPayload, LoginResponse } from '../types/auth';

export const authApi = {
    login: (payload: LoginPayload) => apiClient.post<LoginResponse>('/auth/login', payload),

    logout: () => apiClient.post<null>('/auth/logout'),

    me: () => apiClient.get<AuthUser>('/auth/me'),
};