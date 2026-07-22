import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { createUserSchema, editUserSchema } from '../validators/user.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<UserController>(TOKENS.UserController);

router.use(requireAuth);

router.post(
  '/',
  authorize('user.create'),
  validateRequest(createUserSchema),
  asyncHandler(controller.create)
);
router.get('/', authorize('user.view'), asyncHandler(controller.list));
router.get('/:id', authorize('user.view'), asyncHandler(controller.getOne));
router.patch(
  '/:id',
  authorize('user.edit'),
  validateRequest(editUserSchema),
  asyncHandler(controller.update)
);
router.delete('/:id', authorize('user.delete'), asyncHandler(controller.delete));
router.post(
  '/:id/revoke-sessions',
  authorize('user.edit'),
  asyncHandler(controller.revokeSessions)
);

export default router;