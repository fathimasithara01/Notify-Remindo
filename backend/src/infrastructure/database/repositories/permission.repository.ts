import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository.interface';
import { Permission, NewPermission } from '../../../domain/entities/permission.entity';
import { PermissionModel, PermissionDocument } from '../models/permission.model';
import { RolePermissionModel } from '../models/role-permission.model';

@injectable()
export class PermissionRepository implements IPermissionRepository {
  async create(data: NewPermission): Promise<Permission> {
    const doc = await PermissionModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Permission | null> {
    const doc = await PermissionModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const doc = await PermissionModel.findOne({ name });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewPermission>): Promise<Permission | null> {
    const doc = await PermissionModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    await RolePermissionModel.deleteMany({ permissionId: id });
    const result = await PermissionModel.findByIdAndDelete(id);
    return result !== null;
  }

  async list(filter?: { module?: string; search?: string }): Promise<Permission[]> {
    const query: Record<string, unknown> = {};
    if (filter?.module) query.module = filter.module;
    if (filter?.search) {
      query.name = new RegExp(filter.search.trim(), 'i');
    }

    const docs = await PermissionModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async assignToRole(roleId: string, permissionIds: string[]): Promise<void> {
    const roleObjectId = new Types.ObjectId(roleId);
    const ops = permissionIds.map((permissionId) => ({
      updateOne: {
        filter: { roleId: roleObjectId, permissionId: new Types.ObjectId(permissionId) },
        update: {
          $setOnInsert: {
            roleId: roleObjectId,
            permissionId: new Types.ObjectId(permissionId),
          },
        },
        upsert: true, // idempotent — safe to call multiple times
      },
    }));
    if (ops.length > 0) {
      await RolePermissionModel.bulkWrite(ops);
    }
  }

  async removeFromRole(roleId: string, permissionIds: string[]): Promise<void> {
    await RolePermissionModel.deleteMany({
      roleId,
      permissionId: { $in: permissionIds },
    });
  }

  async listByRole(roleId: string): Promise<Permission[]> {
    const links = await RolePermissionModel.find({ roleId });
    const permissionIds = links.map((link) => link.permissionId);
    const docs = await PermissionModel.find({ _id: { $in: permissionIds } });
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: PermissionDocument): Permission {
    return {
      id: doc._id.toString(),
      name: doc.name,
      module: doc.module,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}