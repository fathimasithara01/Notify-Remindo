import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { ITokenService } from '../../../domain/services/token.service.interface';
import { UnauthorizedError } from '../../../domain/errors/domain.error';

export interface RefreshTokenResult {
  token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.TokenService) private tokenService: ITokenService
  ) { }

  async execute(userId: string): Promise<RefreshTokenResult> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.status === 'inactive') {
      throw new UnauthorizedError('User is not active');
    }

    const role = await this.roleRepo.findById(user.roleId);
    if (!role || role.status === 'inactive') {
      throw new UnauthorizedError('Role is not active');
    }

    const token = this.tokenService.sign({
      userId: user.id,
      roleId: role.id,
      roleSlug: role.slug,
    });

    return { token };
  }
}