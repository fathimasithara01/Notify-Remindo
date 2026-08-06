import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { loginSchema, acceptInviteSchema, resetPasswordSchema, changePasswordSchema } from '../validators/auth.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();
const controller = container.resolve<AuthController>(TOKENS.AuthController);

router.post('/login', authRateLimiter, validateRequest(loginSchema), asyncHandler(controller.login));
router.post('/refresh-token', authRateLimiter, asyncHandler(controller.refreshToken));

router.get('/verify-invite-token/:token', asyncHandler(controller.verifyInviteToken));
router.post(
    '/accept-invite',
    authRateLimiter,
    validateRequest(acceptInviteSchema),
    asyncHandler(controller.acceptInvite)
);

// Protected
router.post('/reset-password', authRateLimiter, requireAuth, validateRequest(resetPasswordSchema), asyncHandler(controller.resetPassword));
router.get('/me', requireAuth, asyncHandler(controller.me));
router.post('/logout', requireAuth, asyncHandler(controller.logout));
router.post('/logout-all-devices', requireAuth, asyncHandler(controller.logoutAllDevices));
router.post( '/change-password', requireAuth, validateRequest(changePasswordSchema), asyncHandler(controller.changePassword));

export default router;