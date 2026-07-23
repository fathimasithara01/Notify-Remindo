import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { loginSchema, acceptInviteSchema } from '../validators/auth.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();
const controller = container.resolve<AuthController>(TOKENS.AuthController);

router.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  asyncHandler(controller.login)
);
router.post('/logout', asyncHandler(controller.logout));
router.post('/refresh-token', asyncHandler(controller.refreshToken));
router.get('/me', requireAuth, asyncHandler(controller.me));

// Public — no auth required, these ARE the auth bootstrap flow
router.get('/verify-invite-token/:token', asyncHandler(controller.verifyInviteToken));
router.post(
  '/accept-invite',
  authRateLimiter,
  validateRequest(acceptInviteSchema),
  asyncHandler(controller.acceptInvite)
);

export default router;
// add
// POST /invites/resend  router.post('/invites/resend',requireAuth,authorize(Permissions.Invites.Resend),asyncHandler(controller.resendInvite));
// DELETE /invites/:id   router.delete('/invites/:id',requireAuth,authorize(Permissions.Invites.Delete),asyncHandler(controller.cancelInvite));
// GET /invites - router.get('/invites',  requireAuth,  authorize(Permissions.Invites.Read),  asyncHandler(controller.listInvites));
