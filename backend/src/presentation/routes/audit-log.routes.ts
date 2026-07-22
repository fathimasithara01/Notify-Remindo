import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuditLogController } from '../controllers/audit-log.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<AuditLogController>(TOKENS.AuditLogController);

router.use(requireAuth);

router.get('/', authorize('auditlog.view'), asyncHandler(controller.list));

export default router;