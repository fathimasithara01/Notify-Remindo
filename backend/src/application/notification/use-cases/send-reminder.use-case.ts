import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { NotFoundError } from '../../../domain/errors/domain.error';

type NotificationMode = 'whatsapp' | 'email';
type NotifierMap = Record<NotificationMode, INotifierService>;

@injectable()
export class SendReminderUseCase {
  constructor(
    @inject(TOKENS.NotificationRepository) private notificationRepo: INotificationRepository,
    @inject(TOKENS.OrganizationRepository) private orgRepo: IOrganizationRepository,
    @inject(TOKENS.NotifierMap) private notifiers: NotifierMap
  ) { }

  async execute(notificationId: string): Promise<void> {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.status !== 'pending') {
      return;
    }

    const organization = await this.orgRepo.findById(notification.organizationId);
    if (!organization) {
      await this.notificationRepo.markFailed(notification.id);
      throw new NotFoundError('Organization not found');
    }

    const notifier = this.notifiers[notification.mode];
    const destination =
      notification.mode === 'email' ? organization.contactEmail : organization.contactPhone;

    try {
      await notifier.send({
        to: destination,
        subject: 'Reminder: upcoming due date',
        message: `Reminder for ${notification.referenceType} on organization "${organization.name}" — action required soon.`,
      });

      await this.notificationRepo.markSent(notification.id, new Date());
    } catch (error) {
      await this.notificationRepo.markFailed(notification.id);
      throw error;
    }
  }
}