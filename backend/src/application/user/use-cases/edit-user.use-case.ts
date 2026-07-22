import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { NotFoundError } from '../../../domain/errors/domain.error';
import { EditUserDto } from '../../dtos/create-user.dto';

@injectable()
export class EditUserUseCase {
  constructor(@inject(TOKENS.UserRepository) private userRepo: IUserRepository) {}

  async execute(userId: string, data: EditUserDto): Promise<User> {
    const updated = await this.userRepo.update(userId, data);
    if (!updated) {
      throw new NotFoundError('User not found');
    }
    return updated;
  }
}