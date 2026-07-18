import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { Notification } from '../../../domain/entities/notification.entity';
import { DomainError } from '../../../domain/errors/domain.error';

export interface ScheduleNotificationDto {
  organizationId: string;
  referenceType: 'PDC_ISSUED' | 'PDC_RECEIVED' | 'HR_DOC';
  referenceId: string;
  notifyBefore: number;
  mode: 'whatsapp' | 'email';
  expiryDate: Date;
}

@injectable()
export class ScheduleNotificationUseCase {
  constructor(
    @inject(TOKENS.NotificationRepository) private notificationRepo: INotificationRepository
  ) {}

  async execute(data: ScheduleNotificationDto): Promise<Notification> {
    if (data.notifyBefore < 0) {
      throw new DomainError('notifyBefore must be zero or a positive number of days');
    }

    const scheduledAt = new Date(data.expiryDate);
    scheduledAt.setDate(scheduledAt.getDate() - data.notifyBefore);

    if (scheduledAt.getTime() < Date.now()) {
      throw new DomainError('Computed reminder date is already in the past');
    }

    return this.notificationRepo.create({
      organizationId: data.organizationId,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      notifyBefore: data.notifyBefore,
      mode: data.mode,
      scheduledAt,
    });
  }
}