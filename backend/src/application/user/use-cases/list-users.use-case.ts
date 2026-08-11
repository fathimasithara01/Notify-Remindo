import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserStatus } from '../../../domain/entities/user.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';

interface ListUsersInput {
  organizationId: string;
  status?: UserStatus;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListUsersUseCase {
  constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<PaginatedResult<User>> {
    return this.userRepo.list({
      organizationId: input.organizationId,
      status: input.status,
      search: input.search,
      page: input.pagination.page,
      limit: input.pagination.limit,
    });
  }
}