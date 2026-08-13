import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { PaginatedResult, PaginationParams } from '../../../shared/utils/pagination';

interface ListUsersInput {
  organizationId: string;
  search?: string;
  pagination: PaginationParams;
}

@injectable()
export class ListUsersUseCase {
  constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<PaginatedResult<User>> {
    return this.userRepo.list({
      organizationId: input.organizationId,
      search: input.search,
      page: input.pagination.page,
      limit: input.pagination.limit,
    });
  }
}