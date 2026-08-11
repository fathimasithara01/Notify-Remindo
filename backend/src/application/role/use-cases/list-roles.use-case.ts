import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { NewRole, Role, RoleStatus } from '../../../domain/entities/role.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';

interface ListRolesInput {
  organizationId?: string;
  status?: RoleStatus;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TOKENS.RoleRepository) private roleRepository: IRoleRepository) {}

  async execute(input: ListRolesInput): Promise<PaginatedResult<Role>> {
    return this.roleRepository.list(
      {
        organizationId: input.organizationId,
        status: input.status,
        search: input.search,
      },
      input.pagination
    );
  }
}