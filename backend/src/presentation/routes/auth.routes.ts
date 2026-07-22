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
router.post('/refresh', asyncHandler(controller.refreshToken));

router.post('/logout', requireAuth, asyncHandler(controller.logout));
router.get('/me', requireAuth, asyncHandler(controller.me));

// Invite
router.get('/invites/:token', asyncHandler(controller.verifyInviteToken));
router.post('/invites/accept', validateRequest(acceptInviteSchema), asyncHandler(controller.acceptInvite));


// add
// POST /invites/resend  router.post('/invites/resend',requireAuth,authorize(Permissions.Invites.Resend),asyncHandler(controller.resendInvite));
// DELETE /invites/:id   router.delete('/invites/:id',requireAuth,authorize(Permissions.Invites.Delete),asyncHandler(controller.cancelInvite));
// GET /invites - router.get('/invites',  requireAuth,  authorize(Permissions.Invites.Read),  asyncHandler(controller.listInvites));
export default router;