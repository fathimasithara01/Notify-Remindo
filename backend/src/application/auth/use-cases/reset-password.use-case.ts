import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { DomainError } from '../../../domain/errors/domain.error';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';

export interface ResetPasswordDto {
  token: string;
  password: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const user = await this.platformUserRepo.findByResetPasswordToken(data.token);
    if (!user) {
      throw new DomainError('This reset link is invalid or has already been used.');
    }

    // if (!user.resetPasswordTokenExpiresAt || user.resetPasswordTokenExpiresAt.getTime() < Date.now()) {
    //   throw new DomainError('This reset link has expired. Ask an admin to send a new one.');
    // }

    const passwordHash = await this.hashService.hash(data.password);

    await this.platformUserRepo.resetPassword(user.id, passwordHash);
  }
}