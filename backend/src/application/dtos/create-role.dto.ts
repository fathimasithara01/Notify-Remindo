import { RoleStatus } from "../../domain/entities/role.entity";

export interface CreatedByUserSummary {
  id: string;
  name: string;
}

export interface createdRoleDto {
  id: string;
  name: string;
  description?: string;

  permissionIds: string[];

  isSystem: boolean;
  status: RoleStatus;

  createdBy: string;
  createdByUser: CreatedByUserSummary | null;

  deletion: {
    isDeleted: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };


  createdAt: Date;
  updatedAt: Date;
}
