import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { PlatformUser, PlatformUserStatus } from '../../../domain/entities/platformUser.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';

interface EditPlatformUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: PlatformUserStatus;
}

@injectable()
export class EditPlatformUserUseCase {
  constructor(@inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository) {}

  async execute(input: EditPlatformUserInput): Promise<PlatformUser> {
    const { id, ...updateData } = input;
    const updated = await this.platformUserRepo.update(id, updateData);
    if (!updated) throw new NotFoundError('Platform user not found');
    return updated;
  }
}