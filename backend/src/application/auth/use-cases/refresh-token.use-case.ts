import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.TokenService) private tokenService: ITokenService
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResult> {
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('User is not active');
    }

    if ((payload.tokenVersion ?? 0) !== user.tokenVersion) {
      throw new UnauthorizedError('Session has been revoked. Please log in again.');
    }

    const roles = await this.userRepo.listRoles(user.id);
    const activeRoles = roles.filter((r) => r.status === 'active');
    if (activeRoles.length === 0) {
      throw new UnauthorizedError('No active role assigned');
    }

    const newPayload = {
      userId: user.id,
      roleIds: activeRoles.map((r) => r.id),
      roleSlugs: activeRoles.map((r) => r.slug),
      organizationId: user.organizationId,
      tokenVersion: user.tokenVersion,
    };

    return {
      accessToken: this.tokenService.signAccessToken(newPayload),
      refreshToken: this.tokenService.signRefreshToken(newPayload),
    };
  }
}