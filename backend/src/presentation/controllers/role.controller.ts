import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { DeleteRoleUseCase } from '../../application/role/use-cases/delete-role.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError, UnauthorizedError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';
import { RolePermissionCache } from '../../infrastructure/cache/role-permission-cache';
import { container } from '../../infrastructure/di/container';

@injectable()
export class RoleController {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.PermissionRepository) private permissionRepo: IPermissionRepository,
    @inject(TOKENS.CreateRoleUseCase) private createRoleUseCase: CreateRoleUseCase,
    @inject(TOKENS.EditRoleUseCase) private editRoleUseCase: EditRoleUseCase,
    @inject(TOKENS.DeleteRoleUseCase) private deleteRoleUseCase: DeleteRoleUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const role = await this.createRoleUseCase.execute(req.body);
    ApiResponse.created(res, role);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { search } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const roles = await this.roleRepo.list({ search: search as string | undefined });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = roles.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(roles.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const role = await this.roleRepo.findWithPermissions(req.params.id);
    if (!role) throw new NotFoundError('Role not found');
    ApiResponse.success(res, role);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    const role = await this.editRoleUseCase.execute({
      roleId: req.params.id,
      adminId: req.user.userId,
      data: req.body,
    });
    ApiResponse.success(res, role, 200, 'Role updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();

    await this.deleteRoleUseCase.execute({
      roleId: req.params.id,
      adminId: req.user.userId,
    });
    ApiResponse.success(res, null, 200, 'Role deleted');
  };


  getPermissions = async (req: Request, res: Response): Promise<void> => {
    const permissions = await this.permissionRepo.listByRole(req.params.id);
    ApiResponse.success(res, permissions);
  };

  addPermission = async (req: Request, res: Response): Promise<void> => {
    const role = await this.roleRepo.findById(req.params.id);
    if (!role) throw new NotFoundError('Role not found');

    await this.permissionRepo.assignToRole(req.params.id, [req.body.permissionId]);
    container.resolve<RolePermissionCache>(TOKENS.RolePermissionCache).invalidate(req.params.id);

    const permissions = await this.permissionRepo.listByRole(req.params.id);
    ApiResponse.success(res, permissions, 200, 'Permission added');
  };

  removePermission = async (req: Request, res: Response): Promise<void> => {
    const role = await this.roleRepo.findById(req.params.id);
    if (!role) throw new NotFoundError('Role not found');

    await this.permissionRepo.removeFromRole(req.params.id, [req.params.permissionId]);
    container.resolve<RolePermissionCache>(TOKENS.RolePermissionCache).invalidate(req.params.id);

    const permissions = await this.permissionRepo.listByRole(req.params.id);
    ApiResponse.success(res, permissions, 200, 'Permission removed');
  };
}