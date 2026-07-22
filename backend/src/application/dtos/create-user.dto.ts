export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface EditUserDto {
  name?: string;
  roleId?: string;
  status?: 'active' | 'inactive';
}