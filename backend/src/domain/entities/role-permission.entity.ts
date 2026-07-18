export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

export type NewRolePermission = Omit<RolePermission, 'id' | 'createdAt'>;