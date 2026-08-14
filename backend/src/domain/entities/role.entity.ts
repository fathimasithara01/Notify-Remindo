export type RoleStatus = 'active' | 'inactive';

export interface Role {
  id: string;
  name: string;
  description?: string;

  permissionIds: string[];

  isSystem: boolean;
  status: RoleStatus;

  createdBy: string;

  deletion: {
    isDeleted: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };


  createdAt: Date;
  updatedAt: Date;
}

export type NewRole = Omit<Role, "id" | "createdAt" | "updatedAt" | "isSystem" | "deletion"> & {
  isSystem?: boolean;
  deletion?: {
    isDeleted?: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };
};