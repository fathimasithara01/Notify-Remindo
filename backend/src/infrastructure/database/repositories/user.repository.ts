import { injectable } from 'tsyringe';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, NewUser } from '../../../domain/entities/user.entity';
import { UserModel, UserDocument } from '../models/user.model';

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
    roleId?: string;
    organizationId?: string;
  }): Promise<User[]> {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter?.status) query.status = filter.status;
    if (filter?.roleId) query.roleId = filter.roleId;
    if (filter?.organizationId) query.organizationId = filter.organizationId;

    const docs = await UserModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      roleId: doc.roleId.toString(),
      status: doc.status,
      organizationId: doc.organizationId ? doc.organizationId.toString() : null,
      inviteToken: doc.inviteToken,
      inviteTokenExpiresAt: doc.inviteTokenExpiresAt,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}