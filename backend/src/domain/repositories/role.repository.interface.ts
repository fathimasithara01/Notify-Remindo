import { Role, NewRole, RoleStatus } from '../entities/role.entity';
import { PaginatedResult, PaginationParams } from "../../shared/utils/pagination";

export interface IRoleRepository {
  create(data: NewRole): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByIds(ids: string[]): Promise<Role[]>;
  update(id: string, data: Partial<NewRole>): Promise<Role | null>;
  softDelete(id: string, deletedBy: string): Promise<boolean>;
  list(
    filter?: { organizationId?: string; status?: RoleStatus; search?: string },
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Role>>;
  findByName(name: string): Promise<Role | null>
}