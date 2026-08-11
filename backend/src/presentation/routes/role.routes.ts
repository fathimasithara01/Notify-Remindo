import { Router } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { RoleController } from '../controllers/role.controller';
import { requirePermission } from '../middlewares/requirePermission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import { createRoleSchema, editRoleSchema } from '../validators/role.validator';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { authenticate } from '../middlewares/require-auth.middleware';

const router = Router();
const roleController = container.resolve<RoleController>(TOKENS.RoleController);

router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.ROLE_CREATE),
  validateRequest(createRoleSchema),
  roleController.create
);

router.get('/', authenticate, requirePermission(PERMISSIONS.ROLE_VIEW), roleController.list);

router.patch(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.ROLE_UPDATE),
  validateRequest(editRoleSchema),
  roleController.update
);

router.delete('/:id', authenticate, requirePermission(PERMISSIONS.ROLE_DELETE), roleController.delete);

export default router;