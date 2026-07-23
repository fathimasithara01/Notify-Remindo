import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { PermissionController } from '../controllers/permission.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<PermissionController>(TOKENS.PermissionController);

router.use(requireAuth);

router.get('/', authorize('permission.view'), asyncHandler(controller.list));
router.get('/:id', authorize('permission.view'), asyncHandler(controller.getOne));

export default router;