import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<DashboardController>(TOKENS.DashboardController);

router.use(requireAuth);

router.get('/report', authorize('dashboard.view'), asyncHandler(controller.getReport));

export default router;