import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { PlatformUser, PlatformUserStatus } from '../../../domain/entities/platformUser.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';

interface ListPlatformUsersInput {
  status?: PlatformUserStatus;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListPlatformUsersUseCase {
  constructor(@inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository) {}

  async execute(input: ListPlatformUsersInput): Promise<PaginatedResult<PlatformUser>> {
    return this.platformUserRepo.list({
      status: input.status,
      search: input.search,
      page: input.pagination.page,
      limit: input.pagination.limit,
    });
  }
}