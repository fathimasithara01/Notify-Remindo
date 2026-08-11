import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { PlatformUser } from '../../../domain/entities/platformUser.entity';
import { ConflictError, NotFoundError } from '../../../domain/errors/domain.error';

interface CreatePlatformUserInput {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

interface CreatePlatformUserOutput {
  user: PlatformUser;
  temporaryPassword: string;
}

function generateTempPassword(): string {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
}

@injectable()
export class CreatePlatformUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(input: CreatePlatformUserInput): Promise<CreatePlatformUserOutput> {
    const existing = await this.platformUserRepo.findByEmail(input.email);
    if (existing) throw new ConflictError('A platform user with this email already exists');

    const role = await this.roleRepo.findById(input.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new NotFoundError('Role not found or inactive');
    }

    const temporaryPassword = generateTempPassword();
    const passwordHash = await this.hashService.hash(temporaryPassword);

    const user = await this.platformUserRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
      roleId: input.roleId,
      status: 'active',
      mustChangePassword: true,
    });

    return { user, temporaryPassword };
  }
}