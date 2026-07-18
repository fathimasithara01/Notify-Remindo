export type RoleStatus = 'active' | 'inactive';

export interface Role {
  id: string;
  name: string; 
  slug: string; 
  description?: string;
  isSystem: boolean;
  status: RoleStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewRole = Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'isSystem'> & {
  isSystem?: boolean;
};

export interface RoleWithPermissions extends Role {
  permissions: string[];  
}