import { Router } from 'express';
import { container } from 'tsyringe';
import { TOKENS } from '../../infrastructure/di/tokens';
import { PlatformUserController } from '../controllers/platform-user.controller';
import { authenticate } from '../middlewares/authorize.middleware';
import { requirePermission } from '../middlewares/requirePermission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';

const router = Router();
const controller = container.resolve<PlatformUserController>(TOKENS.PlatformUserController);

router.post('/', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.create);
router.get('/', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.list);
router.patch('/:id', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.update);
router.delete('/:id', authenticate, requirePermission(PERMISSIONS.PLATFORM_USER_MANAGE), controller.delete);

export default router;