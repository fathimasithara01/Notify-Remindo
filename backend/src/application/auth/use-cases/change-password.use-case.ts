import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { DomainError, NotFoundError, UnauthorizedError } from '../../../domain/errors/domain.error';

export interface ChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(data: ChangePasswordDto): Promise<void> {
    const user = await this.userRepo.findById(data.userId);
    if (!user) throw new NotFoundError('User not found');

    // Even for a forced first-change, we still require the current
    // (temp) password — this proves the person doing the change actually
    // has the credential the admin handed out, not just an active session.
    if (!user.passwordHash) {
      throw new DomainError('This account has no password set. Contact an administrator.');
    }

    const currentMatches = await this.hashService.compare(data.currentPassword, user.passwordHash);
    if (!currentMatches) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const newPasswordHash = await this.hashService.hash(data.newPassword);

    // resetPassword() bumps tokenVersion internally, which invalidates
    // every other session — appropriate here since we're retiring a
    // temp/shared-knowledge password.
    await this.userRepo.resetPassword(user.id, newPasswordHash);
    await this.userRepo.update(user.id, { mustChangePassword: false });
  }
}