import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';
import { LoginDto, LoginResult } from '../../dtos/login.dto';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';

@injectable()
export class LoginAdminUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private readonly platformRoleRepo: IPlatformRoleRepository,
    @inject(TOKENS.HashService) private readonly hashService: IHashService,
    @inject(TOKENS.TokenService) private readonly tokenService: ITokenService,
    @inject(TOKENS.PermissionResolver) private readonly permissionResolver: IPermissionResolver
  ) {}

  async execute(data: LoginDto): Promise<LoginResult> {
    const user = await this.platformUserRepo.findByEmail(data.email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    if (user.status === 'invited') {
      throw new UnauthorizedError('Please accept your invite before logging in');
    }
    if (user.status === 'suspended') {
      throw new UnauthorizedError('This account has been suspended. Contact an administrator.');
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

    const role = await this.platformRoleRepo.findById(user.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new UnauthorizedError('No active role assigned. Contact an administrator.');
    }

    const permissions = await this.permissionResolver.resolve(role.id);

    const payload = {
      userId: user.id,
      roleId: role.id,
      roleName: role.name,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    await this.platformUserRepo.update(user.id, { lastLoginAt: new Date() });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: role.name,
        permissions: Array.from(permissions),
      },
    };
  }
}