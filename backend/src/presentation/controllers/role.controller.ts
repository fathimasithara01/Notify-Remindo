import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { CreateRoleUseCase } from '../../application/role/use-cases/create-role.use-case';
import { EditRoleUseCase } from '../../application/role/use-cases/edit-role.use-case';
import { AssignPermissionsUseCase } from '../../application/role/use-cases/assign-permissions.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError } from '../../domain/errors/domain.error';

@injectable()
export class RoleController {
  constructor(
    @inject(TOKENS.RoleRepository) private roleRepo: IRoleRepository,
    @inject(TOKENS.CreateRoleUseCase) private createRoleUseCase: CreateRoleUseCase,
    @inject(TOKENS.EditRoleUseCase) private editRoleUseCase: EditRoleUseCase,
    @inject(TOKENS.AssignPermissionsUseCase) private assignPermissionsUseCase: AssignPermissionsUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const role = await this.createRoleUseCase.execute(req.body);
    ApiResponse.created(res, role);
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const roles = await this.roleRepo.list();
    ApiResponse.success(res, roles);
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

  assignPermissions = async (req: Request, res: Response): Promise<void> => {
    const role = await this.assignPermissionsUseCase.execute({
      roleId: req.params.id as string,
      permissionIds: req.body.permissionIds,
    });
    ApiResponse.success(res, role, 200, 'Permissions updated');
  };
}