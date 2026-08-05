import { Role } from './role.entity';

export interface UserRoleAssignment {
  id: string;       // the assignment (UserRole) id
  userId: string;
  roleId: string;
  createdAt: Date;
  role: Role;
}