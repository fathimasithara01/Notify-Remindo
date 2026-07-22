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

// router.post( '/', authorize('permission.create'), validateRequest(createPermissionSchema), asyncHandler(controller.create));
router.get('/', authorize('permission.view'), asyncHandler(controller.list));
router.get('/:id', authorize('permission.view'), asyncHandler(controller.getOne));
// router.patch( '/:id', authorize('permission.edit'), validateRequest(editPermissionSchema), asyncHandler(controller.update));
// router.delete('/:id', authorize('permission.delete'), asyncHandler(controller.delete));

// only
// GET /permissions
// GET /permissions/:id

export default router;