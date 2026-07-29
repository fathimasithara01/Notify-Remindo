import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';

import { INotificationRepository } from '../../../domain/repositories/notification.repository.interface';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

import { INotifierService } from '../../../domain/services/notifier.service.interface';
import { NotFoundError, DomainError } from '../../../domain/errors/domain.error';

type NotificationMode = 'whatsapp' | 'email';
type NotifierMap = Record<NotificationMode, INotifierService>;

@injectable()
export class SendReminderUseCase {
  constructor(
    @inject(TOKENS.NotificationRepository)
    private notificationRepo: INotificationRepository,

    @inject(TOKENS.OrganizationRepository)
    private orgRepo: IOrganizationRepository,

    @inject(TOKENS.UserRepository)
    private userRepo: IUserRepository,

    @inject(TOKENS.NotifierMap)
    private notifiers: NotifierMap
  ) { }

  async execute(notificationId: string): Promise<void> {
    // 1. Find notification
    const notification =
      await this.notificationRepo.findById(notificationId);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Only pending notifications can be sent
    if (notification.status !== 'pending') {
      return;
    }

    // 3. Find organization
    const organization = await this.orgRepo.findById(notification.organizationId);

    if (!organization) {
      await this.notificationRepo.markFailed(
        notification.id
      );

      throw new NotFoundError('Organization not found');
    }

    // 4. Find Organization Admin User
    const orgAdmin = await this.userRepo.findOrganizationAdmin(organization.id);

    if (!orgAdmin) {
      await this.notificationRepo.markFailed(
        notification.id
      );

      throw new NotFoundError(
        'Organization admin user not found'
      );
    }

    // 5. Get notifier based on mode
    const notifier = this.notifiers[notification.mode];

    if (!notifier) {
      await this.notificationRepo.markFailed(
        notification.id
      );

      throw new DomainError(
        `Unsupported notification mode: ${notification.mode}`
      );
    }

    // 6. Get recipient
    const destination =   notification.mode === 'email'     ? orgAdmin.email     : orgAdmin.phone;

    if (!destination) {
      await this.notificationRepo.markFailed(
        notification.id
      );

      throw new DomainError(
        `No ${notification.mode} contact available for organization admin`
      );
    }

    try {
      // 7. Send notification
      await notifier.send({
        to: destination,
        subject: 'Reminder: upcoming due date',
        message:
          `Reminder for ${notification.referenceType} ` +
          `on organization "${organization.name}" — ` +
          `action required soon.`,
      });

      // 8. Mark notification as sent
      await this.notificationRepo.markSent(
        notification.id,
        new Date()
      );
    } catch (error) {
      // 9. Mark failed if sending fails
      await this.notificationRepo.markFailed(
        notification.id
      );

      throw error;
    }
  }
}