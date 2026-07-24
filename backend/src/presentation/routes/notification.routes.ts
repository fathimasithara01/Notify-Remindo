import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { scheduleNotificationSchema, editNotificationSchema } from '../validators/notification.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<NotificationController>(TOKENS.NotificationController);

router.use(requireAuth);

router.post(
  '/',
  authorize('notification.create'),
  validateRequest(scheduleNotificationSchema),
  asyncHandler(controller.schedule)
);
router.get('/', authorize('notification.view'), asyncHandler(controller.list));
router.get('/:id', authorize('notification.view'), asyncHandler(controller.getOne));
router.patch(
  '/:id',
  authorize('notification.create'),
  validateRequest(editNotificationSchema),
  asyncHandler(controller.update)
);
router.post('/:id/send-now', authorize('notification.send'), asyncHandler(controller.sendNow));
router.delete('/:id', authorize('notification.delete'), asyncHandler(controller.delete));

export default router;