import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
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
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
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

    const role = await this.roleRepo.findById(user.roleId);
    if (!role || role.status === 'inactive') {
      throw new UnauthorizedError('Role is not active');
    }

    const newPayload = {
      userId: user.id,
      roleId: role.id,
      roleSlug: role.slug,
      organizationId: user.organizationId,
    };

    return {
      accessToken: this.tokenService.signAccessToken(newPayload),
      refreshToken: this.tokenService.signRefreshToken(newPayload),
    };
  }
}