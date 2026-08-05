import axiosInstance from '@/lib/api/axios-instance';
import { AuthUser, LoginPayload, LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      payload
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  me: async (): Promise<AuthUser> => {
    const response = await axiosInstance.get<AuthUser>('/auth/me');
    return response.data;
  },
};