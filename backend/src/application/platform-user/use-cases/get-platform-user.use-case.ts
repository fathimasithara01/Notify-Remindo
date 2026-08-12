import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';
import { PlatformUserWithRole } from '../../dtos/platform-user.dto';

@injectable()
export class GetPlatformUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository
  ) {}

  async execute(id: string): Promise<PlatformUserWithRole> {
    const user = await this.platformUserRepo.findByIdWithRole(id);
    if (!user) {
      throw new NotFoundError('Platform user not found');
    }
    return user;
  }
}