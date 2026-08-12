import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { NotFoundError, ValidationError } from '../../../domain/errors/domain.error';

interface Input { userId: string; adminId: string; }

@injectable()
export class UnblockPlatformUserUseCase {
    constructor(@inject(TOKENS.PlatformUserRepository) private repo: IPlatformUserRepository) { }

    async execute({ userId }: Input) {
        const user = await this.repo.findById(userId);
        if (!user) throw new NotFoundError('Platform user not found');
        if (user.status !== 'suspended') throw new ValidationError('User is not suspended');

        return this.repo.update(userId, { status: 'active' });
    }
}