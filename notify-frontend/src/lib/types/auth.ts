export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; 
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}