import { injectable } from 'tsyringe';
import { IUserRepository, OrganizationAdminSummary } from '../../../domain/repositories/user.repository.interface';
import { User, NewUser } from '../../../domain/entities/user.entity';
import { UserModel, UserDocument } from '../models/user.model';
import { PaginatedResult, buildPaginatedResult, getOffset } from '../../../shared/utils/pagination';
import { OrganizationStatus } from '../../../domain/entities/organization.entity';

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: NewUser): Promise<User> {
    const doc = await UserModel.create(data);
    return this.toEntity(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string, organizationId?: string): Promise<User | null> {
    const query: Record<string, unknown> = {
      email: email.toLowerCase().trim(),
    };

    if (organizationId) {
      query.organizationId = organizationId;
    }

    const doc = await UserModel.findOne(query);
    return doc ? this.toEntity(doc) : null;
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async resetPassword(userId: string, passwordHash: string): Promise<boolean> {
    const res = await UserModel.updateOne(
      { _id: userId },
      { $set: { passwordHash }, $inc: { tokenVersion: 1 } }
    );
    return res.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const res = await UserModel.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async list(filter: {
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>> {
    const params = { page: filter.page, limit: filter.limit };
    const skip = getOffset(params);

    const query: Record<string, unknown> = {};
    // if (filter.status) query.status = filter.status;
    if (filter.organizationId) query.organizationId = filter.organizationId;
    if (filter.search) query.$text = { $search: filter.search };

    const [docs, total] = await Promise.all([
      UserModel.find(query).skip(skip).limit(params.limit).sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);

    return buildPaginatedResult(docs.map(this.toEntity), total, params);
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { roleId } });
  }

  async findOrganizationAdmin(organizationId: string): Promise<OrganizationAdminSummary | null> {
    const doc = await UserModel.findOne({ organizationId }).sort({ createdAt: 1 });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      // name: `${doc.firstName} ${doc.lastName}`,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: null,
    };
  }

  async cancelInvite(userId: string): Promise<boolean> {
    const res = await UserModel.deleteOne({ _id: userId, status: 'invited' });
    return res.deletedCount > 0;
  }

  async countByRoleId(roleId: string): Promise<number> {
    return UserModel.countDocuments({ roleId });
  }

  async findOneByOrganizationAndStatus(organizationId: string, status: OrganizationStatus): Promise<User | null> {
    const doc = await UserModel.findOne({ organizationId, status });
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      organizationId: doc.organizationId.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash ?? null,
      firstName: doc.firstName,
      lastName: doc.lastName,
      roleId: doc.roleId.toString(),
      phone: doc.phone,
      tokenVersion: doc.tokenVersion,
      lastLoginAt: doc.lastLoginAt,
      // inviteToken: doc.inviteToken,
      // inviteTokenExpiresAt: doc.inviteTokenExpiresAt,
      resetPasswordToken: doc.resetPasswordToken,
      resetPasswordTokenExpiresAt: doc.resetPasswordTokenExpiresAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      // mustChangePassword: doc.mustChangePassword,
    };
  }
}