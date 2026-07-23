import { Permission, NewPermission } from '../entities/permission.entity';

export interface IPermissionRepository {
  create(data: NewPermission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  update(id: string, data: Partial<NewPermission>): Promise<Permission | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: { module?: string; search?: string }): Promise<Permission[]>;

  assignToRole(roleId: string, permissionIds: string[]): Promise<void>;
  removeFromRole(roleId: string, permissionIds: string[]): Promise<void>;
  listByRole(roleId: string): Promise<Permission[]>;
}