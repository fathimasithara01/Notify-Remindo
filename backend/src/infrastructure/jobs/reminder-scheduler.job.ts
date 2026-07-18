import cron from 'node-cron';
import { container } from '../di/container';
import { TOKENS } from '../di/tokens';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { IOrganizationRepository } from '../../domain/repositories/organization.repository.interface';
import { INotifierService } from '../../domain/services/notifier.service.interface';
import { SendReminderUseCase } from '../../application/notification/use-cases/send-reminder.use-case';

type NotifierMap = Record<'whatsapp' | 'email' | 'in_app', INotifierService>;

async function runDueNotifications(): Promise<void> {
  const notificationRepo = container.resolve<INotificationRepository>(TOKENS.NotificationRepository);
  const orgRepo = container.resolve<IOrganizationRepository>(TOKENS.OrganizationRepository);
  const notifiers = container.resolve<NotifierMap>(TOKENS.NotifierMap);

  const due = await notificationRepo.listDue(new Date());
  if (due.length === 0) return;

  console.log(`[reminder-scheduler] dispatching ${due.length} due notification(s)`);

  const useCase = new SendReminderUseCase(notificationRepo, orgRepo, notifiers);

  for (const notification of due) {
    try {
      await useCase.execute(notification.id);
    } catch (error) {
      console.error(`[reminder-scheduler] failed to send notification ${notification.id}:`, error);
    }
  }
}

export function startReminderScheduler(): void {
  cron.schedule('*/5 * * * *', () => {
    runDueNotifications().catch((error) => {
      console.error('[reminder-scheduler] run failed:', error);
    });
  });

  console.log('[reminder-scheduler] started — checking every 5 minutes');
}