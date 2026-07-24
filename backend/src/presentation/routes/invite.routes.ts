import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { InviteController } from '../controllers/invite.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<InviteController>(TOKENS.InviteController);

router.use(requireAuth);

router.get('/', authorize('organization.view'), asyncHandler(controller.list));
router.post('/resend', authorize('organization.edit'), asyncHandler(controller.resend));
router.delete('/:id', authorize('organization.edit'), asyncHandler(controller.cancel));

export default router;