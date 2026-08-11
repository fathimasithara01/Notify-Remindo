import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { DomainError } from '../../../domain/errors/domain.error';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';

export interface VerifyInviteTokenResult {
  email: string;
}

@injectable()
export class VerifyInviteTokenUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository
  ) {}

  async execute(token: string): Promise<VerifyInviteTokenResult> {
    const user = await this.platformUserRepo.findByInviteToken(token);
    if (!user || user.status !== 'invited') {
      throw new DomainError('This invite link is invalid or has already been used.');
    }

    if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt.getTime() < Date.now()) {
      throw new DomainError('This invite link has expired. Ask an admin to resend it.');
    }

    return { email: user.email };
  }
}