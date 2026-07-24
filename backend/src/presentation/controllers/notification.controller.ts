import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { ScheduleNotificationUseCase } from '../../application/notification/use-cases/schedule-notification.use-case';
import { SendReminderUseCase } from '../../application/notification/use-cases/send-reminder.use-case';
import { ApiResponse } from '../../shared/utils/api-response';
import { NotFoundError } from '../../domain/errors/domain.error';
import { parsePagination, paginationMeta } from '../../shared/utils/pagination';

@injectable()
export class NotificationController {
  constructor(
    @inject(TOKENS.NotificationRepository) private notificationRepo: INotificationRepository,
    @inject(TOKENS.ScheduleNotificationUseCase) private scheduleUseCase: ScheduleNotificationUseCase,
    @inject(TOKENS.SendReminderUseCase) private sendReminderUseCase: SendReminderUseCase
  ) {}

  schedule = async (req: Request, res: Response): Promise<void> => {
    const notification = await this.scheduleUseCase.execute(req.body);
    ApiResponse.created(res, notification);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { organizationId, status, mode } = req.query;
    const pagination = parsePagination(req.query as Record<string, unknown>);

    const notifications = await this.notificationRepo.list({
      organizationId: organizationId as string | undefined,
      status: status as 'pending' | 'sent' | 'failed' | undefined,
      mode: mode as 'whatsapp' | 'email' | 'in_app' | undefined,
    });

    const start = (pagination.page - 1) * pagination.limit;
    const pageItems = notifications.slice(start, start + pagination.limit);

    ApiResponse.success(res, {
      items: pageItems,
      meta: paginationMeta(notifications.length, pagination),
    });
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const notification = await this.notificationRepo.findById(req.params.id);
    if (!notification) throw new NotFoundError('Notification not found');
    ApiResponse.success(res, notification);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const notification = await this.notificationRepo.update(req.params.id, req.body);
    if (!notification) throw new NotFoundError('Notification not found');
    ApiResponse.success(res, notification, 200, 'Notification updated');
  };

  sendNow = async (req: Request, res: Response): Promise<void> => {
    await this.sendReminderUseCase.execute(req.params.id);
    ApiResponse.success(res, null, 200, 'Notification sent');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.notificationRepo.delete(req.params.id);
    if (!deleted) throw new NotFoundError('Notification not found');
    ApiResponse.success(res, null, 200, 'Notification cancelled');
  };
}