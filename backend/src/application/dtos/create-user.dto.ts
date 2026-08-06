export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  roleIds: string[];
}

export interface EditUserDto {
  name?: string;
  status?: 'active' | 'inactive';
}