import { Router } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { PlatformUserController } from '../controllers/platform-user.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { requirePermission } from '../middlewares/requirePermission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<PlatformUserController>(TOKENS.PlatformUserController);

router.post('/', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.create);
router.get('/', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.list);
router.patch('/:id', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.update);
router.delete('/:id', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.delete);

router.post('/:id/revoke-sessions',authenticate, requirePermission(PERMISSIONS.USER_UPDATE), asyncHandler(controller.revokeSessions));
router.post('/:id/resend-invite', authenticate,requirePermission(PERMISSIONS.USER_INVITE), asyncHandler(controller.resendInvite));
router.post('/:id/request-password-reset',authenticate, requirePermission(PERMISSIONS.USER_UPDATE), asyncHandler(controller.requestPasswordReset));


export default router;