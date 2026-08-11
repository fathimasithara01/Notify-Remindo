import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITokenRevocationRegistry } from '../../../domain/services/token-revocation-registry.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';

@injectable()
export class LogoutAllDevicesUseCase {
    constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
        @inject(TOKENS.TokenRevocationRegistry) private tokenRevocationRegistry: ITokenRevocationRegistry
    ) { }

    async execute(userId: string): Promise<void> {
        const user = await this.platformUserRepo.findById(userId);

        if (!user) throw new NotFoundError('User not found');

        // Increment token version
        const newTokenVersion = user.tokenVersion + 1;

        // Update database
        await this.platformUserRepo.update(user.id, {
            tokenVersion: newTokenVersion,
        });

        // Revoke all old tokens
        this.tokenRevocationRegistry.revoke(
            user.id,
            newTokenVersion
        );
    }
}