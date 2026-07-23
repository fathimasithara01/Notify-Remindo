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
import { User } from '../../domain/entities/user.entity';

function toSafeUser(user: User) {
  const { id, name, email, status, organizationId, createdAt } = user;
  return { id, name, email, status, organizationId, createdAt };
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
    const { search } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const internalUsers = await this.userRepo.list({
      internalOnly: true,
      search: search as string | undefined,
    });

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


  getRoles = async (req: Request, res: Response): Promise<void> => {
    const roles = await this.userRepo.listRoles(req.params.id as string);
    ApiResponse.success(res, roles);
  };

  assignRole = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userRepo.findById(req.params.id as string);
    if (!user) throw new NotFoundError('User not found');

    await this.userRepo.assignRole(req.params.id as string, req.body.roleId);
    const roles = await this.userRepo.listRoles(req.params.id as string);
    ApiResponse.success(res, roles, 200, 'Role assigned');
  };

  removeRole = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userRepo.findById(req.params.id as string);
    if (!user) throw new NotFoundError('User not found');

    await this.userRepo.removeRole(req.params.id as string, req.params.roleId as string);
    const roles = await this.userRepo.listRoles(req.params.id as string);
    ApiResponse.success(res, roles, 200, 'Role removed');
  };
}