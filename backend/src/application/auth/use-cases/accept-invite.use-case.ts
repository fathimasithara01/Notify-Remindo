import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { DomainError } from '../../../domain/errors/domain.error';
import { LoginResult } from '../../dtos/login.dto';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';
import { IPermissionResolver } from '../../../domain/services/IPermissionResolver';

export interface AcceptInviteDto {
  token: string;
  password: string;
}

@injectable()
export class AcceptInviteUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private platformRoleRepo: IPlatformRoleRepository,
    @inject(TOKENS.HashService) private hashService: IHashService,
    @inject(TOKENS.TokenService) private tokenService: ITokenService,
        @inject(TOKENS.PermissionResolver) private readonly permissionResolver: IPermissionResolver
    
  ) {}

  async execute(data: AcceptInviteDto): Promise<LoginResult> {
    const user = await this.platformUserRepo.findByInviteToken(data.token);
    if (!user || user.status !== 'invited') {
      throw new DomainError('This invite link is invalid or has already been used.');
    }


    const passwordHash = await this.hashService.hash(data.password);

    const updated = await this.platformUserRepo.update(user.id, {
      passwordHash,
      status: 'active',

    });
    if (!updated) throw new DomainError('Failed to activate account. Please try again.');


    const role = await this.platformRoleRepo.findById(updated.roleId);
    if (!role) throw new DomainError('Failed to activate account. Please try again.');

        const permissions = await this.permissionResolver.resolve(role.id);

    const payload = {
      userId: updated.id,
      roleId: role.id,
      roleName: role.name,
      tokenVersion: updated.tokenVersion,
    };

    return {
      accessToken: this.tokenService.signAccessToken(payload),
      refreshToken: this.tokenService.signRefreshToken(payload),
      user: {
        id: updated.id,
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        role: role.name,
                permissions: Array.from(permissions),
      },
    };
  }
}