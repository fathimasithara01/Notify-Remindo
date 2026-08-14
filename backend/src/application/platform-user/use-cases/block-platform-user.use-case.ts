import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';

@injectable()
export class BlockPlatformUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository
  ) {}

  async execute(id: string) {
    const user = await this.platformUserRepo.update(id, { status: 'inactive' });
    if (!user) {
      throw new NotFoundError('Platform user not found');
    }
    return user;
  }
}