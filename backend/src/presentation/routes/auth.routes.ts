import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { loginSchema } from '../validators/auth.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const controller = container.resolve<AuthController>(TOKENS.AuthController);
 
router.post('/login',loginLimiter, validateRequest(loginSchema), asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.post('/refresh-token', requireAuth, asyncHandler(controller.refreshToken));
router.get('/me', requireAuth, asyncHandler(controller.me));
 
export default router;