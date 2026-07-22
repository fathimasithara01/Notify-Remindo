import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.use-case';
import { EditUserUseCase } from '../../application/user/use-cases/edit-user.use-case';
import { RevokeSessionsUseCase } from '../../application/user/use-cases/revoke-sessions.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

function toSafeUser(user: { id: string; name: string; email: string; roleId: string; status: string; createdAt: Date }) {
  const { id, name, email, roleId, status, createdAt } = user;
  return { id, name, email, roleId, status, createdAt };
}

@injectable()
export class UserController {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(TOKENS.EditUserUseCase) private editUserUseCase: EditUserUseCase,
    @inject(TOKENS.RevokeSessionsUseCase) private revokeSessionsUseCase: RevokeSessionsUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.createUserUseCase.execute(req.body);
    ApiResponse.created(res, toSafeUser(user));
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const allUsers = await this.userRepo.list();
    const internalUsers = allUsers.filter((u) => !u.organizationId);

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = internalUsers.slice(start, start + pagination.limit).map(toSafeUser);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(internalUsers.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userRepo.findById(req.params.id as string);
    if (!user) throw new NotFoundError('User not found');
    ApiResponse.success(res, toSafeUser(user));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.editUserUseCase.execute(req.params.id as string, req.body);
    ApiResponse.success(res, toSafeUser(user), 200, 'User updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.userRepo.delete(req.params.id as string);
    if (!deleted) throw new NotFoundError('User not found');
    ApiResponse.success(res, null, 200, 'User deleted');
  };

  revokeSessions = async (req: Request, res: Response): Promise<void> => {
    await this.revokeSessionsUseCase.execute(req.params.id as string);
    ApiResponse.success(res, null, 200, 'All sessions revoked for this user');
  };
}