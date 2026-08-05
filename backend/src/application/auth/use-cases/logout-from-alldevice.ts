import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { ITokenRevocationRegistry } from '../../../domain/services/token-revocation-registry.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';

@injectable()
export class LogoutAllDevicesUseCase {
    constructor(
        @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
        @inject(TOKENS.TokenRevocationRegistry) private tokenRevocationRegistry: ITokenRevocationRegistry
    ) { }

    async execute(userId: string): Promise<void> {
        const user = await this.userRepo.findById(userId);

        if (!user) throw new NotFoundError('User not found');

        // Increment token version
        const newTokenVersion = user.tokenVersion + 1;

        // Update database
        await this.userRepo.update(user.id, {
            tokenVersion: newTokenVersion,
        });

        // Revoke all old tokens
        this.tokenRevocationRegistry.revoke(
            user.id,
            newTokenVersion
        );
    }
}