import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/use-cases/delete-role.use-case';
import { AssignPermissionsUseCase } from '../../application/role/use-cases/assign-permissions.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class RoleController {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.CreateRoleUseCase) private createRoleUseCase: CreateRoleUseCase,
    @inject(TOKENS.EditRoleUseCase) private editRoleUseCase: EditRoleUseCase,
    @inject(TOKENS.DeleteRoleUseCase) private deleteRoleUseCase: DeleteRoleUseCase,
    @inject(TOKENS.AssignPermissionsUseCase) private assignPermissionsUseCase: AssignPermissionsUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const role = await this.createRoleUseCase.execute(req.body);
    ApiResponse.created(res, role);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const roles = await this.roleRepo.list();

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = roles.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(roles.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const role = await this.roleRepo.findWithPermissions(req.params.id as string);
    if (!role) throw new NotFoundError('Role not found');
    ApiResponse.success(res, role);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const role = await this.editRoleUseCase.execute(req.params.id as string, req.body);
    ApiResponse.success(res, role, 200, 'Role updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    await this.deleteRoleUseCase.execute({
      roleId: req.params.id as string,
      adminId: req.user.userId,
    });
    ApiResponse.success(res, null, 200, 'Role deleted');
  };

  assignPermissions = async (req: Request, res: Response): Promise<void> => {
    const role = await this.assignPermissionsUseCase.execute({
      roleId: req.params.id as string,
      permissionIds: req.body.permissionIds,
    });
    ApiResponse.success(res, role, 200, 'Permissions updated');
  };
}