import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { NotFoundError, ValidationError } from '../../../domain/errors/domain.error';

interface Input { userId: string; adminId: string; }

@injectable()
export class BlockPlatformUserUseCase {
    constructor(@inject(TOKENS.PlatformUserRepository) private repo: IPlatformUserRepository) { }

    async execute({ userId, adminId }: Input) {
        if (userId === adminId) throw new ValidationError('Cannot block your own account');

        const user = await this.repo.findById(userId);
        if (!user) throw new NotFoundError('Platform user not found');
        if (user.status === 'suspended') throw new ValidationError('User is already suspended');

        return this.repo.update(userId, {
            status: 'suspended',
            tokenVersion: user.tokenVersion + 1, 
        });
    }
}