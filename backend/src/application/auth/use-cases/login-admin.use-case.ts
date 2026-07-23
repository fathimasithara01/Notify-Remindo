import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';
import { LoginDto, LoginResult } from '../../dtos/login.dto';

@injectable()
export class LoginAdminUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.HashService) private hashService: IHashService,
    @inject(TOKENS.TokenService) private tokenService: ITokenService
  ) {}

  async execute(data: LoginDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'invited') {
      throw new UnauthorizedError('Please accept your invite and set a password before logging in');
    }

    if (user.status === 'inactive') {
      throw new UnauthorizedError('This account has been deactivated');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await this.hashService.compare(data.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const roles = await this.userRepo.listRoles(user.id);
    const activeRoles = roles.filter((r) => r.status === 'active');
    if (activeRoles.length === 0) {
      throw new UnauthorizedError('No active role assigned. Contact an administrator.');
    }

    const payload = {
      userId: user.id,
      roleIds: activeRoles.map((r) => r.id),
      roleSlugs: activeRoles.map((r) => r.slug),
      organizationId: user.organizationId,
      tokenVersion: user.tokenVersion,
    };

    return {
      accessToken: this.tokenService.signAccessToken(payload),
      refreshToken: this.tokenService.signRefreshToken(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: activeRoles.map((r) => r.slug),
      },
    };
  }
}