export type RoleStatus = 'active' | 'inactive';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: string[];
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description?: string;
}

export interface EditRolePayload {
  name?: string;
  description?: string;
  status?: RoleStatus;
}