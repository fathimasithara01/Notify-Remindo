import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class PermissionController {
  constructor(
    @inject(TOKENS.PermissionRepository) private permissionRepo: IPermissionRepository
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { module, search } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);
    const permissions = await this.permissionRepo.list({
      module: module as string | undefined,
      search: search as string | undefined,
    });

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
}