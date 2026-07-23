import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { IHashService } from '../../../domain/services/hash.service.interface';
import { User } from '../../../domain/entities/user.entity';
import { ConflictError, DomainError } from '../../../domain/errors/domain.error';
import { CreateUserDto } from '../../dtos/create-user.dto';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.HashService) private hashService: IHashService
  ) {}

  async execute(data: CreateUserDto): Promise<User> {
    if (data.roleIds.length === 0) {
      throw new DomainError('At least one role is required');
    }

    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`An account already exists for ${data.email}`);
    }

    for (const roleId of data.roleIds) {
      const role = await this.roleRepo.findById(roleId);
      if (!role || role.status !== 'active') {
        throw new DomainError(`Role ${roleId} is not available`);
      }
    }

    const passwordHash = await this.hashService.hash(data.password);

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash,
      status: 'active',
      organizationId: null,
      tokenVersion: 0,
    });

    for (const roleId of data.roleIds) {
      await this.userRepo.assignRole(user.id, roleId);
    }

    return user;
  }
}