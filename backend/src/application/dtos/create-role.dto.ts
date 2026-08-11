export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: string[];
}
