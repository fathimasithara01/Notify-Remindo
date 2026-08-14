import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { RoleStatus } from '../../../domain/entities/role.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';
import { createdRoleDto } from '../../dtos/create-role.dto';

interface ListRolesInput {
  organizationId?: string;
  status?: RoleStatus;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListRolesUseCase {
  constructor(@inject(TOKENS.PlatformRoleRepository) private roleRepository: IPlatformRoleRepository) {}

  async execute(input: ListRolesInput): Promise<PaginatedResult<createdRoleDto>> {
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