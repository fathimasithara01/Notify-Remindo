export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roleSlugs: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}