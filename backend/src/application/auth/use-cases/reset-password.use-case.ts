import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { DomainError } from '../../../domain/errors/domain.error';

export interface ResetPasswordDto {
  token: string;
  password: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const user = await this.userRepo.findByResetPasswordToken(data.token);
    if (!user) {
      throw new DomainError('This reset link is invalid or has already been used.');
    }

    if (!user.resetPasswordTokenExpiresAt || user.resetPasswordTokenExpiresAt.getTime() < Date.now()) {
      throw new DomainError('This reset link has expired. Ask an admin to send a new one.');
    }

    const passwordHash = await this.hashService.hash(data.password);

    // resetPassword() bumps tokenVersion internally, invalidating every
    // existing session — anyone logged in under the old password is
    // signed out everywhere. Correct behavior for a credential reset.
    await this.userRepo.resetPassword(user.id, passwordHash);
    await this.userRepo.update(user.id, {
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    });
  }
}