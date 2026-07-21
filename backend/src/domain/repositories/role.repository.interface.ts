import { Role, NewRole, RoleWithPermissions } from '../entities/role.entity';

export interface IRoleRepository {
  create(data: NewRole): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findBySlug(slug: string): Promise<Role | null>;
  update(id: string, data: Partial<NewRole>): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: { status?: 'active' | 'inactive'; search?: string }): Promise<Role[]>;

  findWithPermissions(id: string): Promise<RoleWithPermissions | null>;
}