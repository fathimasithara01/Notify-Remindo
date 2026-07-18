import { AuditLog, NewAuditLog } from '../entities/audit-log.entity';

export interface IAuditLogRepository {
  create(data: NewAuditLog): Promise<AuditLog>;

  list(filter?: {
    adminId?: string;
    targetType?: AuditLog['targetType'];
    targetId?: string;
  }): Promise<AuditLog[]>;
}