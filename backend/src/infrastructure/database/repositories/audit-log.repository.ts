import { injectable } from 'tsyringe';
import { IAuditLogRepository } from '../../../domain/repositories/audit-log.repository.interface';
import { AuditLog, NewAuditLog } from '../../../domain/entities/audit-log.entity';
import { AuditLogModel, AuditLogDocument } from '../models/audit-log.model';

@injectable()
export class AuditLogRepository implements IAuditLogRepository {
  
    async create(data: NewAuditLog): Promise<AuditLog> {
    const doc = await AuditLogModel.create(data);
    return this.toDomain(doc);
  }

  async list(filter?: { adminId?: string; targetType?: AuditLog['targetType']; targetId?: string;}): Promise<AuditLog[]> {
    const query: Record<string, unknown> = {};
    if (filter?.adminId) query.adminId = filter.adminId;
    if (filter?.targetType) query.targetType = filter.targetType;
    if (filter?.targetId) query.targetId = filter.targetId;

    const docs = await AuditLogModel.find(query).sort({ createdAt: -1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: AuditLogDocument): AuditLog {
    return {
      id: doc._id.toString(),
      adminId: doc.adminId.toString(),
      action: doc.action,
      targetType: doc.targetType,
      targetId: doc.targetId.toString(),
      metadata: doc.metadata,
      createdAt: doc.createdAt,
    };
  }
}