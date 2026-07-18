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

    async list(filter?: { status?: 'active' | 'inactive'; roleId?: string }): Promise<User[]> {
        const query: Record<string, unknown> = { deletedAt: null };
        if (filter?.status) query.status = filter.status;
        if (filter?.roleId) query.roleId = filter.roleId;

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
            deletedAt: doc.deletedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}

// @injectable(): "Ee class container create cheyyam."Class-ne container create cheyyan allow cheyyunnu.

// @inject():  "Ee constructor parameter-il ee dependency inject cheyyu." Constructor-il ethu object inject cheyyanam ennu parayunnu.

// container.resolve() → Container automatic ayi object create cheythu dependencies inject