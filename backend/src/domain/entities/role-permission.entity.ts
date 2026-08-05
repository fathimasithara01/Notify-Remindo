import { Permission } from './permission.entity';

export interface RolePermissionAssignment {
  id: string;         // the assignment (RolePermission) id
  roleId: string;
  permissionId: string;
  createdAt: Date;
  permission: Permission;
}