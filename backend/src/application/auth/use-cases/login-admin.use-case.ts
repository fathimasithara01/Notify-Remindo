import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';
import { LoginDto, LoginResult } from '../../dtos/login.dto';

@injectable()
export class LoginAdminUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private readonly roleRepo: IRoleRepository,
    @inject(TOKENS.HashService) private readonly hashService: IHashService,
    @inject(TOKENS.TokenService) private readonly tokenService: ITokenService
  ) {}

  async execute(data: LoginDto): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(data.email, data.organizationId);
    if (!user) throw new UnauthorizedError('Invalid email or password');

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

    const role = await this.roleRepo.findById(user.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new UnauthorizedError('No active role assigned. Contact an administrator.');
    }

    const payload = {
      userId: user.id,
      roleId: role.id,
      roleName: role.name,
      organizationId: user.organizationId,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    await this.userRepo.update(user.id, { lastLoginAt: new Date() });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: role.name,
      },
    };
  }
}