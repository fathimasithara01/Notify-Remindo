import { Notification, NewNotification } from '../entities/notification.entity';

export interface INotificationRepository {
  create(data: NewNotification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  update(id: string, data: Partial<NewNotification>): Promise<Notification | null>;
  delete(id: string): Promise<boolean>;

  list(filter?: {
    organizationId?: string;
    status?: 'pending' | 'sent' | 'failed';
    mode?: 'whatsapp' | 'email' | 'in_app';
  }): Promise<Notification[]>;

  listDue(before: Date): Promise<Notification[]>;

  markSent(id: string, sentAt: Date): Promise<Notification | null>;
  markFailed(id: string): Promise<Notification | null>;
}