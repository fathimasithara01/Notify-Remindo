import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { scheduleNotificationSchema, editNotificationSchema } from '../validators/notification.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';

const router = Router();
const controller = container.resolve<NotificationController>(TOKENS.NotificationController);

router.use(authenticate);

router.post('/', authorize(PERMISSIONS.NOTIFICATION_CREATE), validateRequest(scheduleNotificationSchema), asyncHandler(controller.schedule));
router.get('/', authorize(PERMISSIONS.NOTIFICATION_VIEW), asyncHandler(controller.list));
router.get('/:id', authorize(PERMISSIONS.NOTIFICATION_VIEW), asyncHandler(controller.getOne));
router.patch('/:id', authorize(PERMISSIONS.NOTIFICATION_UPDATE), validateRequest(editNotificationSchema), asyncHandler(controller.update));
// router.post('/:id/send-now', authorize(PERMISSIONS.NOTIFICATION_SEND), asyncHandler(controller.sendNow));
router.delete('/:id', authorize(PERMISSIONS.NOTIFICATION_DELETE), asyncHandler(controller.delete));

export default router;