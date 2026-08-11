import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.error';

interface DeletePlatformUserInput {
  id: string;
  requestedBy: string; // id of the platform user performing the deletion
}

@injectable()
export class DeletePlatformUserUseCase {
  constructor(@inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository) {}

  async execute(input: DeletePlatformUserInput): Promise<void> {
    if (input.id === input.requestedBy) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    const existing = await this.platformUserRepo.findById(input.id);
    if (!existing) throw new NotFoundError('Platform user not found');

    const success = await this.platformUserRepo.delete(input.id);
    if (!success) throw new NotFoundError('Platform user not found');
  }
}