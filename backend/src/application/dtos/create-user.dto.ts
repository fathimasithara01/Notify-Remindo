export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

export interface EditUserDto {
  firstName?: string;
  lastName?: string;
  status?: 'active' | 'inactive' | 'suspended';
  roleId?: string;
}