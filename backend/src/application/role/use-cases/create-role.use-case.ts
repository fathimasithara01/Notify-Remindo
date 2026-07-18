import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { Role } from '../../../domain/entities/role.entity';
import { ConflictError } from '../../../domain/errors/domain.error';
import { CreateRoleDto } from '../../dtos/create-role.dto';

@injectable()
export class CreateRoleUseCase {
  constructor(@inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository) {}

  async execute(data: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepo.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError(`A role with slug "${data.slug}" already exists`);
    }

    return this.roleRepo.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      status: 'active',
    });
  }
}