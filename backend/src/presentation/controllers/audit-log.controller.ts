import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { ApiResponse } from '../../shared/utils/api-response';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class AuditLogController {
  constructor(@inject(TOKENS.AuditLogRepository) private auditLogRepo: IAuditLogRepository) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { adminId, targetType, targetId } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const logs = await this.auditLogRepo.list({
      adminId: adminId as string | undefined,
      targetType: targetType as AuditLog['targetType'] | undefined,
      targetId: targetId as string | undefined,
    });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = logs.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(logs.length, pagination),
    });
  };
}