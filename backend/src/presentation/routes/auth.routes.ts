import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { loginSchema, acceptInviteSchema } from '../validators/auth.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<AuthController>(TOKENS.AuthController);

router.post('/login', validateRequest(loginSchema), asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.post('/refresh-token', requireAuth, asyncHandler(controller.refreshToken));
router.get('/me', requireAuth, asyncHandler(controller.me));

router.get('/verify-invite-token/:token', asyncHandler(controller.verifyInviteToken));
router.post(
  '/accept-invite',
  validateRequest(acceptInviteSchema),
  asyncHandler(controller.acceptInvite)
);

export default router;