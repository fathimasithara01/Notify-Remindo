import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { CreatePlatformUserUseCase } from '../../application/platform-user/use-cases/create-platform-user.use-case';
import { EditPlatformUserUseCase } from '../../application/platform-user/use-cases/edit-platform-user.use-case';
import { ListPlatformUsersUseCase } from '../../application/platform-user/use-cases/list-platform-users.use-case';
import { DeletePlatformUserUseCase } from '../../application/platform-user/use-cases/delete-platform-user.use-case';
import { parsePaginationParams } from '../../shared/utils/pagination';

@injectable()
export class PlatformUserController {
  constructor(
    @inject(TOKENS.CreatePlatformUserUseCase) private createUseCase: CreatePlatformUserUseCase,
    @inject(TOKENS.EditPlatformUserUseCase) private editUseCase: EditPlatformUserUseCase,
    @inject(TOKENS.ListPlatformUsersUseCase) private listUseCase: ListPlatformUsersUseCase,
    @inject(TOKENS.DeletePlatformUserUseCase) private deleteUseCase: DeletePlatformUserUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, temporaryPassword } = await this.createUseCase.execute(req.body);
      // TODO: send temporaryPassword via email using EmailNotifierService, do not return it in response
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.editUseCase.execute({ id: req.params.id, ...req.body });
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePaginationParams(req.query);
      const result = await this.listUseCase.execute({
        status: req.query.status as any,
        search: req.query.search as string | undefined,
        pagination,
      });
      res.status(200).json({ success: true, data: result.items, meta: result.meta });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user as { id: string };
      await this.deleteUseCase.execute({ id: req.params.id, requestedBy: currentUser.id });
      res.status(200).json({ success: true, message: 'Platform user deleted' });
    } catch (err) {
      next(err);
    }
  };
}