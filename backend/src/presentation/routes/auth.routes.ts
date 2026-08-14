import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { loginSchema, acceptInviteSchema, resetPasswordSchema, changePasswordSchema } from '../validators/auth.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();
const controller = container.resolve<AuthController>(TOKENS.AuthController);

router.post('/login', authRateLimiter, validateRequest(loginSchema), asyncHandler(controller.login));
router.post('/refresh-token', authRateLimiter, asyncHandler(controller.refreshToken));

// router.post(
//   '/accept-invite',
//   authRateLimiter,
//   validateRequest(acceptInviteSchema),
//   asyncHandler(controller.acceptInvite)
// );

router.post(
  '/reset-password',
  authRateLimiter,
  validateRequest(resetPasswordSchema),
  asyncHandler(controller.resetPassword)
);

// Protected
router.get('/me', authenticate, asyncHandler(controller.me));
router.post('/logout', authenticate, asyncHandler(controller.logout));
router.post('/logout-all-devices', authenticate, asyncHandler(controller.logoutAllDevices));
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), asyncHandler(controller.changePassword));

export default router;