import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, NewUser } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { UserModel, UserDocument } from '../models/user.model';
import { UserRoleModel } from '../models/user-role.model';
import { RoleModel } from '../models/role.model';

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: NewUser): Promise<User> {
    const doc = await UserModel.create(data);
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ _id: id, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async findByInviteToken(token: string): Promise<User | null> {
    const doc = await UserModel.findOne({ inviteToken: token, deletedAt: null });
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() }
    );
    return result !== null;
  }

  async list(filter?: {
    status?: 'invited' | 'active' | 'inactive';
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
  }): Promise<User[]> {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter?.status) query.status = filter.status;
    if (filter?.organizationId) query.organizationId = filter.organizationId;
    if (filter?.internalOnly) query.organizationId = null;
    if (filter?.search) {
      const regex = new RegExp(filter.search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const docs = await UserModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async listRoles(userId: string): Promise<Role[]> {
    const links = await UserRoleModel.find({ userId });
    const roleIds = links.map((link) => link.roleId);
    const docs = await RoleModel.find({ _id: { $in: roleIds }, deletedAt: null });
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isSystem: doc.isSystem,
      status: doc.status,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await UserRoleModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), roleId: new Types.ObjectId(roleId) },
      { $setOnInsert: { userId: new Types.ObjectId(userId), roleId: new Types.ObjectId(roleId) } },
      { upsert: true }
    );
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await UserRoleModel.deleteOne({ userId, roleId });
  }

  private toDomain(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      status: doc.status,
      organizationId: doc.organizationId ? doc.organizationId.toString() : null,
      inviteToken: doc.inviteToken,
      inviteTokenExpiresAt: doc.inviteTokenExpiresAt,
      tokenVersion: doc.tokenVersion,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}