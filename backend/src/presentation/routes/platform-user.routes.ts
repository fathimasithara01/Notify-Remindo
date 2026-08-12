import { Router } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { PlatformUserController } from '../controllers/platform-user.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { requirePermission } from '../middlewares/requirePermission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { createPlatformUserSchema } from '../validators/platfromUser.validator';

const router = Router();
const controller = container.resolve<PlatformUserController>(TOKENS.PlatformUserController);

router.use(authenticate);

router.post(
  '/',
  requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE),
  validateRequest(createPlatformUserSchema),
  asyncHandler(controller.create)
);
router.get('/', requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), asyncHandler(controller.list));
router.get('/:id', requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), asyncHandler(controller.getOne));
router.patch('/:id', requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), asyncHandler(controller.update));
router.delete('/:id', requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), asyncHandler(controller.delete));

router.post(
  '/:id/revoke-sessions',
  requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE),
  asyncHandler(controller.revokeSessions)
);
router.post(
  '/:id/request-password-reset',
  requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE),
  asyncHandler(controller.requestPasswordReset)
);

export default router;