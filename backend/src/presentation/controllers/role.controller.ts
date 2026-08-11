import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/use-cases/delete-role.use-case';
import { ListRolesUseCase } from '../../application/role/use-cases/list-roles.use-case';
import { parsePaginationParams } from '../../shared/utils/pagination';

@injectable()
export class RoleController {
  constructor(
    @inject(TOKENS.CreateRoleUseCase) private createRoleUseCase: CreateRoleUseCase,
    @inject(TOKENS.EditRoleUseCase) private editRoleUseCase: EditRoleUseCase,
    @inject(TOKENS.DeleteRoleUseCase) private deleteRoleUseCase: DeleteRoleUseCase,
    @inject(TOKENS.ListRolesUseCase) private listRolesUseCase: ListRolesUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user as { id: string };
      const role = await this.createRoleUseCase.execute({
        ...req.body,
        createdBy: currentUser.id,
      });
      res.status(201).json({ success: true, data: role });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = await this.editRoleUseCase.execute({ id: req.params.id, ...req.body });
      res.status(200).json({ success: true, data: role });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user as { id: string };
      await this.deleteRoleUseCase.execute({ id: req.params.id, deletedBy: currentUser.id });
      res.status(200).json({ success: true, message: 'Role deleted' });
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePaginationParams(req.query);
      const result = await this.listRolesUseCase.execute({
        organizationId: req.query.organizationId as string | undefined,
        status: req.query.status as any,
        search: req.query.search as string | undefined,
        pagination,
      });
      res.status(200).json({ success: true, data: result.items, meta: result.meta });
    } catch (err) {
      next(err);
    }
  };
}