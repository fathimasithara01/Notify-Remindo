import { Router } from 'express';
import authRoutes from './auth.routes';
import roleRoutes from './role.routes';
import organizationRoutes from './organization.routes';
import subscriptionRoutes from './subscription.routes';
import dashboardRoutes from './dashboard.routes';
import auditLogRoutes from './audit-log.routes';
import adminRoutes from './platform-user.routes';
import features from './feature.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/organizations', organizationRoutes);
router.use('/subscription-plans', subscriptionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/admin', adminRoutes);
router.use('/features', features);


// router.use('/invites', inviteRoutes);

export default router;

