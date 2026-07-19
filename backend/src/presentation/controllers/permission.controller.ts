import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { ApiResponse } from '../../shared/utils/api-response';
import { ConflictError, NotFoundError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class PermissionController {
  constructor(
    @inject(TOKENS.PermissionRepository) private permissionRepo: IPermissionRepository
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const existing = await this.permissionRepo.findByName(req.body.name);
    if (existing) {
      throw new ConflictError(`Permission "${req.body.name}" already exists`);
    }

    const permission = await this.permissionRepo.create(req.body);
    ApiResponse.created(res, permission);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { module } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const permissions = await this.permissionRepo.list({ module: module as string | undefined });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = permissions.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(permissions.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const permission = await this.permissionRepo.findById(req.params.id as string);
    if (!permission) throw new NotFoundError('Permission not found');
    ApiResponse.success(res, permission);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const permission = await this.permissionRepo.update(req.params.id as string, req.body);
    if (!permission) throw new NotFoundError('Permission not found');
    ApiResponse.success(res, permission, 200, 'Permission updated');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.permissionRepo.delete(req.params.id as string);
    if (!deleted) throw new NotFoundError('Permission not found');
    ApiResponse.success(res, null, 200, 'Permission deleted');
  };
}