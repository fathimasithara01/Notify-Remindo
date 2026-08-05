import { apiClient } from '@/lib/api/client';
import { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => 
    apiClient.post<LoginResponse>(
      '/auth/login',
      payload
    ),

  logout: async (): Promise<void> => 
    await apiClient.post('/auth/logout'),

  me: async (): Promise<AuthUser> => 
    apiClient.get<AuthUser>('/auth/me'),
};