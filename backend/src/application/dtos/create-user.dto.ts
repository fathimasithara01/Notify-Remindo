export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
    phone: string;
  roleId: string;
}

export interface EditUserDto {
  firstName?: string;
  lastName?: string;
  status?: 'active' | 'inactive' | 'suspended';
  roleId?: string;
}