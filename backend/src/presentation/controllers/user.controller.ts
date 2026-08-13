import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.use-case';
import { EditUserUseCase } from '../../application/user/use-cases/edit-user.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/domain.error';
import { parsePaginationParams } from '../../shared/utils/pagination';
import { User } from '../../domain/entities/user.entity';
import { RevokeUserSessionsUseCase } from '../../application/user/use-cases/revoke-sessions.use-case';

function toSafeUser(user: User) {
  const { id, firstName, lastName, email, organizationId, roleId, createdAt } = user;
  return { id, firstName, lastName, email, organizationId, roleId, createdAt };
}

@injectable()
export class UserController {
  constructor(
    @inject(TOKENS.UserRepository) private userRepo: IUserRepository,
    @inject(TOKENS.CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(TOKENS.EditUserUseCase) private editUserUseCase: EditUserUseCase,
    @inject(TOKENS.RevokeUserSessionsUseCase) private revokeUserSessionsUseCase: RevokeUserSessionsUseCase,
  ) { }

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const { user, inviteUrl, emailSent } = await this.createUserUseCase.execute({
      data: req.body,
      adminId: req.user.id,
    });
    ApiResponse.created(res, { ...toSafeUser(user), inviteUrl, emailSent });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { search, status } = req.query;
    const pagination = parsePaginationParams(req.query as Record<string, unknown>);

    const internalUsers = await this.userRepo.list({
      internalOnly: true,
      search: search as string | undefined,
      ...pagination,
    });

    ApiResponse.success(res, internalUsers);
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userRepo.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    ApiResponse.success(res, toSafeUser(user));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.editUserUseCase.execute(req.params.id, req.body);
    ApiResponse.success(res, toSafeUser(user), 200, 'User updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.userRepo.delete(req.params.id);
    if (!deleted) throw new NotFoundError('User not found');
    ApiResponse.success(res, null, 200, 'User deleted');
  };

  revokeSessions = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    await this.revokeUserSessionsUseCase.execute({
      userId: req.params.id,
      adminId: req.user.id,
    });
    ApiResponse.success(res, null, 200, 'Sessions revoked successfully');
  };
}