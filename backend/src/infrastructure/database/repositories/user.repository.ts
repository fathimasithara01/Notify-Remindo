import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { IUserRepository, OrganizationAdminSummary } from '../../../domain/repositories/user.repository.interface';
import { User, NewUser } from '../../../domain/entities/user.entity';
import { UserRoleAssignment } from '../../../domain/entities/user-role.entity';
import { UserModel, UserDocument } from '../models/user.model';
import { UserRoleModel } from '../models/user-role.model';
import { RoleModel } from '../models/role.model';
import { getPaginationOffset, PaginatedResult } from '../../../shared/utils/pagination';

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

  async list(filter: {
    status?: "invited" | "active" | "inactive";
    organizationId?: string;
    internalOnly?: boolean;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>> {

    const query: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.organizationId) {
      query.organizationId = filter.organizationId;
    }

    if (filter.internalOnly) {
      query.organizationId = null;
    }

    if (filter.search?.trim()) {
      const regex = new RegExp(filter.search.trim(), "i");

      query.$or = [
        { name: regex },
        { email: regex },
      ];
    }

    const skip = getPaginationOffset({
      page: filter.page,
      limit: filter.limit,
    });

    const [docs, total] = await Promise.all([
      UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filter.limit),

      UserModel.countDocuments(query),
    ]);

    return {
      items: docs.map(doc => this.toDomain(doc)),
      total,
    };
  }

  async listRoles(userId: string): Promise<UserRoleAssignment[]> {
    const links = await UserRoleModel.find({ userId });
    const roleIds = links.map((link) => link.roleId);
    const roleDocs = await RoleModel.find({ _id: { $in: roleIds }, deletedAt: null });

    // Map for O(1) lookup — also lets us silently skip a link whose role
    // was hard-deleted or is otherwise missing, instead of returning a
    // broken row with `role: undefined` that crashes the frontend.
    const roleById = new Map(roleDocs.map((doc) => [doc._id.toString(), doc]));

    return links
      .filter((link) => roleById.has(link.roleId.toString()))
      .map((link) => {
        const roleDoc = roleById.get(link.roleId.toString())!;
        return {
          id: link._id.toString(),       // the assignment (UserRole) id
          userId: link.userId.toString(),
          roleId: roleDoc._id.toString(),
          createdAt: link.createdAt,
          role: {
            id: roleDoc._id.toString(),
            name: roleDoc.name,
            slug: roleDoc.slug,
            description: roleDoc.description,
            isSystem: roleDoc.isSystem,
            status: roleDoc.status,
            deletedAt: roleDoc.deletedAt,
            createdAt: roleDoc.createdAt,
            updatedAt: roleDoc.updatedAt,
          },
        };
      });
  }

  async findOrganizationAdmin(organizationId: string): Promise<OrganizationAdminSummary | null> {

    const orgAdminRole = await RoleModel.findOne({
      slug: 'orgadmin',
      deletedAt: null,
    }).select('_id').lean();

    if (!orgAdminRole) {
      return null;
    }

    const userRole = await UserRoleModel.findOne({
      roleId: orgAdminRole._id,
    }).select('userId').lean();

    if (!userRole) {
      return null;
    }

    const user = await UserModel.findOne({
      _id: userRole.userId,
      organizationId,
      status: {
        $in: ['active', 'invited'],
      },
      deletedAt: null,
    })
      .select('_id name email phone status')
      .lean();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      status: user.status,
    };
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
      phone: doc.phone,
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