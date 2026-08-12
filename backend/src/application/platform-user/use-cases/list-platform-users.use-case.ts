import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { PlatformUserStatus } from '../../../domain/entities/platformUser.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';
import { PlatformUserWithRole } from '../../dtos/platform-user.dto';

interface ListPlatformUsersInput {
  status?: PlatformUserStatus;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListPlatformUsersUseCase {
  constructor(@inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository) {}

  async execute(input: ListPlatformUsersInput): Promise<PaginatedResult<PlatformUserWithRole>> {
    return this.platformUserRepo.list({
      status: input.status,
      search: input.search,
      page: input.pagination.page,
      limit: input.pagination.limit,
    });
  }
}