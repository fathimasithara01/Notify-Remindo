import { Permission } from "../../shared/constants/permissions.constant";

export interface IPermissionResolver {
  resolve(roleId: string): Promise<Set<Permission>>;
  hasPermission(roleId: string, permission: Permission): Promise<boolean>;
  invalidate(roleId: string): void;
}