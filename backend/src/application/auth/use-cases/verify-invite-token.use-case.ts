import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { DomainError } from '../../../domain/errors/domain.error';

export interface VerifyInviteTokenResult {
    email: string;
    organizationId: string | null;
}

@injectable()
export class VerifyInviteTokenUseCase {
    constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) { }

    async execute(token: string): Promise<VerifyInviteTokenResult> {
        const user = await this.userRepo.findByInviteToken(token);
        if (!user || user.status !== 'invited') {
            throw new DomainError('This invite link is invalid or has already been used.');
        }

        if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt.getTime() < Date.now()) {
            throw new DomainError('This invite link has expired. Ask an admin to resend it.');
        }

        return { email: user.email, organizationId: user.organizationId ?? null };
    }
}