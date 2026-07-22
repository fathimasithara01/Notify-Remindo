import { injectable } from 'tsyringe';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { Notification, NewNotification } from '../../../domain/entities/notification.entity';
import { NotificationModel, NotificationDocument } from '../models/notification.model';

@injectable()
export class NotificationRepository implements INotificationRepository {

    async create(data: NewNotification): Promise<Notification> {
        const doc = await NotificationModel.create(data);
        return this.toDomain(doc);
    }

    async findById(id: string): Promise<Notification | null> {
        const doc = await NotificationModel.findById(id);
        return doc ? this.toDomain(doc) : null;
    }

    async update(id: string, data: Partial<NewNotification>): Promise<Notification | null> {
        const doc = await NotificationModel.findByIdAndUpdate(id, data, { new: true });
        return doc ? this.toDomain(doc) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await NotificationModel.findByIdAndDelete(id);
        return result !== null;
    }

    async list(filter?: { organizationId?: string; status?: 'pending' | 'sent' | 'failed'; mode?: 'whatsapp' | 'email'; }): Promise<Notification[]> {
        const query: Record<string, unknown> = {};
        if (filter?.organizationId) query.organizationId = filter.organizationId;
        if (filter?.status) query.status = filter.status;
        if (filter?.mode) query.mode = filter.mode;

        const docs = await NotificationModel.find(query);
        return docs.map((doc) => this.toDomain(doc));
    }

    async listDue(before: Date): Promise<Notification[]> {
        const docs = await NotificationModel.find({
            status: 'pending',
            scheduledAt: { $lte: before },
        });
        return docs.map((doc) => this.toDomain(doc));
    }

    async markSent(id: string, sentAt: Date): Promise<Notification | null> {
        const doc = await NotificationModel.findByIdAndUpdate(
            id,
            { status: 'sent', sentAt },
            { new: true }
        );
        return doc ? this.toDomain(doc) : null;
    }

    async markFailed(id: string): Promise<Notification | null> {
        const doc = await NotificationModel.findByIdAndUpdate(
            id,
            { status: 'failed' },
            { new: true }
        );
        return doc ? this.toDomain(doc) : null;
    }

    private toDomain(doc: NotificationDocument): Notification {
        return {
            id: doc._id.toString(),
            organizationId: doc.organizationId.toString(),
            referenceType: doc.referenceType,
            referenceId: doc.referenceId.toString(),
            notifyBefore: doc.notifyBefore,
            mode: doc.mode,
            status: doc.status,
            scheduledAt: doc.scheduledAt,
            sentAt: doc.sentAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}