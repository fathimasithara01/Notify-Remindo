import { injectable } from 'tsyringe';
import { IPlatformUserRepository } from '../../../domain/repositories/platform-user.repository.interface';
import { PlatformUser, NewPlatformUser, PlatformUserStatus } from '../../../domain/entities/platformUser.entity';
import { PlatformUserModel, PlatformUserDocument } from '../models/platform-user.model';
import { PaginatedResult, buildPaginatedResult, getOffset } from '../../../shared/utils/pagination';

@injectable()
export class PlatformUserRepository implements IPlatformUserRepository {
    async create(data: NewPlatformUser): Promise<PlatformUser> {
        const doc = await PlatformUserModel.create(data);
        return this.toEntity(doc);
    }

    async findById(id: string): Promise<PlatformUser | null> {
        const doc = await PlatformUserModel.findById(id);
        return doc ? this.toEntity(doc) : null;
    }

    async findByEmail(email: string): Promise<PlatformUser | null> {
        const doc = await PlatformUserModel.findOne({ email: email.toLowerCase() });
        return doc ? this.toEntity(doc) : null;
    }

    async update(id: string, data: Partial<NewPlatformUser>): Promise<PlatformUser | null> {
        const doc = await PlatformUserModel.findByIdAndUpdate(id, { $set: data }, { new: true });
        return doc ? this.toEntity(doc) : null;
    }

    async resetPassword(userId: string, passwordHash: string): Promise<boolean> {
        const result = await PlatformUserModel.updateOne(
            { _id: userId },
            {
                $set: { passwordHash },
                $unset: { resetPasswordToken: '', resetPasswordTokenExpiresAt: '' },
                $inc: { tokenVersion: 1 },
            }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const res = await PlatformUserModel.deleteOne({ _id: id });
        return res.deletedCount > 0;
    }

    async findByResetPasswordToken(token: string): Promise<PlatformUser | null> {
        const doc = await PlatformUserModel.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: new Date() },
        });
        return doc ? this.toEntity(doc) : null;
    }

    async list(filter?: {
        status?: PlatformUserStatus;
        search?: string;
        page: number;
        limit: number;
    }): Promise<PaginatedResult<PlatformUser>> {
        const page = filter?.page ?? 1;
        const limit = filter?.limit ?? 10;
        const params = { page, limit };
        const skip = getOffset(params);

        const query: Record<string, unknown> = {};
        if (filter?.status) query.status = filter.status;
        if (filter?.search) query.$text = { $search: filter.search };

        const [docs, total] = await Promise.all([
            PlatformUserModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            PlatformUserModel.countDocuments(query),
        ]);

        return buildPaginatedResult(docs.map(this.toEntity), total, params);
    }

    async assignRole(userId: string, roleId: string): Promise<void> {
        await PlatformUserModel.updateOne({ _id: userId }, { $set: { roleId } });
    }

    async countByRoleId(roleId: string): Promise<number> {
        return PlatformUserModel.countDocuments({ roleId });
    }


    async findByInviteToken(token: string): Promise<PlatformUser | null> {
        const doc = await PlatformUserModel.findOne({
            inviteToken: token,
            inviteTokenExpiresAt: { $gt: new Date() },
        });
        return doc ? this.toEntity(doc) : null;
    }
    private toEntity(doc: PlatformUserDocument): PlatformUser {
        return {
            id: doc._id.toString(),
            email: doc.email,
            passwordHash: doc.passwordHash,
            firstName: doc.firstName,
            lastName: doc.lastName,
            roleId: doc.roleId.toString(),
            status: doc.status,
            tokenVersion: doc.tokenVersion,
            lastLoginAt: doc.lastLoginAt,
            mustChangePassword: doc.mustChangePassword,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}