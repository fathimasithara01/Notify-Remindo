import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';

const router = Router();
const controller = container.resolve<DashboardController>(TOKENS.DashboardController);

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.DASHBOARD_VIEW), asyncHandler(controller.getReport));

export default router;