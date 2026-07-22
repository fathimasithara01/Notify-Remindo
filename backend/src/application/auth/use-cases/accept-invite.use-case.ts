import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { DomainError } from '../../../domain/errors/domain.error';
import { LoginResult } from '../../dtos/login.dto';

export interface AcceptInviteDto {
  token: string;
  password: string;
}

@injectable()
export class AcceptInviteUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.HashService) private hashService: IHashService,
    @inject(TOKENS.TokenService) private tokenService: ITokenService
  ) {}

  async execute(data: AcceptInviteDto): Promise<LoginResult> {
    const user = await this.userRepo.findByInviteToken(data.token);
    if (!user || user.status !== 'invited') {
      throw new DomainError('This invite link is invalid or has already been used.');
    }

    if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt.getTime() < Date.now()) {
      throw new DomainError('This invite link has expired. Ask an admin to resend it.');
    }

    const passwordHash = await this.hashService.hash(data.password);

    const updated = await this.userRepo.update(user.id, {
      passwordHash,
      status: 'active',
      inviteToken: null,
      inviteTokenExpiresAt: null,
    });

    if (!updated) {
      throw new DomainError('Failed to activate account. Please try again.');
    }

    const role = await this.roleRepo.findById(updated.roleId);

    const payload = {
      userId: updated.id,
      roleId: updated.roleId,
      roleSlug: role?.slug ?? '',
      organizationId: updated.organizationId,
      tokenVersion: updated.tokenVersion,
    };

    return {
      accessToken: this.tokenService.signAccessToken(payload),
      refreshToken: this.tokenService.signRefreshToken(payload),
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: role?.slug ?? '',
      },
    };
  }
}