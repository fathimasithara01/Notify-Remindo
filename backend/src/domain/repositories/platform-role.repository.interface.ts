import { Role, NewRole, RoleStatus } from '../entities/role.entity';
import { PaginatedResult, PaginationParams } from "../../shared/utils/pagination";
import { createdRoleDto } from '../../application/dtos/create-role.dto';

export interface IPlatformRoleRepository {
  create(data: NewRole): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByIds(ids: string[]): Promise<Role[]>;
  update(id: string, data: Partial<NewRole>): Promise<Role | null>;
  softDelete(id: string, deletedBy: string): Promise<boolean>;
  list(filter?: {
    organizationId?: string;
    status?: RoleStatus;
    search?: string;
  }, pagination?: PaginationParams): Promise<PaginatedResult<createdRoleDto>>;
  findByName(name: string): Promise<Role | null>
}