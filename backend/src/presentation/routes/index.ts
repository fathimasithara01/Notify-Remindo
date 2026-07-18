import { Router } from 'express';
import authRoutes from './auth.routes';
import roleRoutes from './role.routes';
import permissionRoutes from './permission.routes';
import organizationRoutes from './organization.routes';
import subscriptionRoutes from './subscription.routes';
import notificationRoutes from './notification.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/organizations', organizationRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;