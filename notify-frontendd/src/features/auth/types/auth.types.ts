import type { PERMISSIONS } from '@/config/permissions';


export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}