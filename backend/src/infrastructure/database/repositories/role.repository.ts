import { injectable } from 'tsyringe';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { Role, NewRole, RoleWithPermissions } from '../../../domain/entities/role.entity';
import { RoleModel, RoleDocument } from '../models/role.model';
import { RolePermissionModel } from '../models/role-permission.model';
import { PermissionModel } from '../models/permission.model';

@injectable()
export class RoleRepository implements IRoleRepository {
  async create(data: NewRole): Promise<Role> {
    const doc = await RoleModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ _id: id, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async findBySlug(slug: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ slug, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewRole>): Promise<Role | null> {
    const doc = await RoleModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const role = await RoleModel.findOne({ _id: id, deletedAt: null });
    if (!role || role.isSystem) return false;

    await RolePermissionModel.deleteMany({ roleId: id });
    const result = await RoleModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), status: 'inactive' }
    );
    return result !== null;
  }

  async list(filter?: { status?: 'active' | 'inactive'; search?: string }): Promise<Role[]> {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter?.status) query.status = filter.status;
    if (filter?.search) {
      const regex = new RegExp(filter.search.trim(), 'i');
      query.$or = [{ name: regex }, { slug: regex }];
    }

    const docs = await RoleModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async findWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    const roleDoc = await RoleModel.findOne({ _id: id, deletedAt: null });
    if (!roleDoc) return null;

    const links = await RolePermissionModel.find({ roleId: id });
    const permissionIds = links.map((link) => link.permissionId);
    const permissionDocs = await PermissionModel.find({ _id: { $in: permissionIds } });

    return {
      ...this.toDomain(roleDoc),
      permissions: permissionDocs.map((p) => p.name),
    };
  }

  private toDomain(doc: RoleDocument): Role {
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isSystem: doc.isSystem,
      status: doc.status,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}