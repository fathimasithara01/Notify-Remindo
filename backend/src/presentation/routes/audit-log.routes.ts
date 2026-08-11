import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { AuditLogController } from '../controllers/audit-log.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';

const router = Router();
const controller = container.resolve<AuditLogController>(TOKENS.AuditLogController);

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.AUDITLOG_VIEW), asyncHandler(controller.list));

export default router;