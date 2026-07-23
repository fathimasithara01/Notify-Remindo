export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
}

export type NewUserRole = Omit<UserRole, 'id' | 'createdAt'>;