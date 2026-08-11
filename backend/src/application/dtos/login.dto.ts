export interface LoginDto {
  email: string;
  password: string;
  organizationId?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string; 
  };
}