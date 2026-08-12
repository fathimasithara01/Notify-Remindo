import { PLatformRoleRepository } from './../../../infrastructure/database/repositories/platform-role.repository';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { PlatformUser } from '../../../domain/entities/platformUser.entity';
import { ConflictError, NotFoundError } from '../../../domain/errors/domain.error';
import { IPlatformRoleRepository } from '../../../domain/repositories/platform-role.repository.interface';

interface CreatePlatformUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone:string;
  roleId: string;
  password: string;
}

@injectable()
export class CreatePlatformUserUseCase {
  constructor(
    @inject(TOKENS.PlatformUserRepository) private platformUserRepo: IPlatformUserRepository,
    @inject(TOKENS.PlatformRoleRepository) private roleRepo: IPlatformRoleRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(input: CreatePlatformUserInput): Promise<PlatformUser> {
    const existing = await this.platformUserRepo.findByEmail(input.email);
    if (existing) throw new ConflictError('A platform user with this email already exists');

    const role = await this.roleRepo.findById(input.roleId);
    if (!role || role.status !== 'active' || role.deletion.isDeleted) {
      throw new NotFoundError('Role not found or inactive');
    }

    const passwordHash = await this.hashService.hash(input.password);

    const user = await this.platformUserRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone:input.phone,
      passwordHash,
      roleId: input.roleId,
      status: 'active',
    });

    return user;
  }
}