import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { RoleController } from '../controllers/role.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { createRoleSchema, editRoleSchema, addPermissionSchema } from '../validators/role.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<RoleController>(TOKENS.RoleController);

router.use(requireAuth);

router.post(
  '/',
  authorize('role.create'),
  validateRequest(createRoleSchema),
  asyncHandler(controller.create)
);
router.get('/', authorize('role.view'), asyncHandler(controller.list));
router.get('/:id', authorize('role.view'), asyncHandler(controller.getOne));
router.patch(
  '/:id',
  authorize('role.edit'),
  validateRequest(editRoleSchema),
  asyncHandler(controller.update)
);
router.delete('/:id', authorize('role.delete'), asyncHandler(controller.delete));

router.get('/:id/permissions', authorize('role.view'), asyncHandler(controller.getPermissions));
router.post(
  '/:id/permissions',
  authorize('role.edit'),
  validateRequest(addPermissionSchema),
  asyncHandler(controller.addPermission)
);
router.delete(
  '/:id/permissions/:permissionId',
  authorize('role.edit'),
  asyncHandler(controller.removePermission)
);

export default router;