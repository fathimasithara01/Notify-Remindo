export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleIds: string[];
}

export interface EditUserDto {
  name?: string;
  status?: 'active' | 'inactive';
}