import { injectable } from 'tsyringe';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { Role, NewRole, RoleStatus } from '../../../domain/entities/role.entity';
import { RoleModel, RoleDocument } from '../models/role.model';
import { buildPaginatedResult, getOffset, PaginatedResult, paginationMeta, PaginationParams } from '../../../shared/utils/pagination';

@injectable()
export class RoleRepository implements IRoleRepository {
  async create(data: NewRole): Promise<Role> {
    const doc = await RoleModel.create(data);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ _id: id, 'deletion.isDeleted': false });
    return doc ? this.toEntity(doc) : null;
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    const docs = await RoleModel.find({ _id: { $in: ids }, 'deletion.isDeleted': false });
    return docs.map(this.toEntity);
  }

  async update(id: string, data: Partial<NewRole>): Promise<Role | null> {
    const doc = await RoleModel.findOneAndUpdate(
      { _id: id, 'deletion.isDeleted': false },
      { $set: data },
      { new: true }
    );
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, deletedBy: string): Promise<boolean> {
    const res = await RoleModel.updateOne(
      { _id: id, 'deletion.isDeleted': false },
      {
        $set: {
          'deletion.isDeleted': true,
          'deletion.deletedBy': deletedBy,
          'deletion.deletedAt': new Date(),
        },
      }
    );
    return res.modifiedCount > 0;
  }



  async list(filter?: {
    organizationId?: string;
    status?: RoleStatus;
    search?: string;
  }, pagination?: PaginationParams): Promise<PaginatedResult<Role>> {
    const params: PaginationParams = pagination ?? { page: 1, limit: 10 };
    const skip = getOffset(params);

    const query: Record<string, unknown> = { 'deletion.isDeleted': false };

    if (filter?.organizationId) query.organizationId = filter.organizationId;
    if (filter?.status) query.status = filter.status;
    if (filter?.search) query.$text = { $search: filter.search };

    const [docs, total] = await Promise.all([
      RoleModel.find(query).skip(skip).limit(params.limit).sort({ createdAt: -1 }),
      RoleModel.countDocuments(query),
    ]);

    return buildPaginatedResult(docs.map(this.toEntity), total, params);
  }

  private toEntity(doc: RoleDocument): Role {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      organizationId: doc.organizationId?.toString(),
      permissionIds: doc.permissionIds,
      isSystem: doc.isSystem,
      status: doc.status,
      createdBy: doc.createdBy,
      deletion: doc.deletion,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}