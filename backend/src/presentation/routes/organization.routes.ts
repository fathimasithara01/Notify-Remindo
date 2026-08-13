import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constant';
import {
  createOrganizationSchema,
  editOrganizationSchema,
  upgradePlanSchema,
  assignSalesmanSchema,
  blockCustomerSchema,
  addContactPersonSchema,
  editContactPersonSchema,
  resetOrganizationAdminPasswordSchema,
} from '../validators/organization.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<OrganizationController>(TOKENS.OrganizationController);

router.use(authenticate); 

router.post('/', authorize(PERMISSIONS.ORG_CREATE), validateRequest(createOrganizationSchema), asyncHandler(controller.create));
router.get('/', authorize(PERMISSIONS.ORG_VIEW), asyncHandler(controller.list));
router.get('/:id', authorize(PERMISSIONS.ORG_VIEW), asyncHandler(controller.getOne));

router.patch('/:id', authorize(PERMISSIONS.ORG_UPDATE), validateRequest(editOrganizationSchema), asyncHandler(controller.update));
// router.delete('/:id', authorize(PERMISSIONS.ORG_DELETE), asyncHandler(controller.delete));

router.post('/:id/block', authorize(PERMISSIONS.ORG_BLOCK), validateRequest(blockCustomerSchema), asyncHandler(controller.block));
router.post('/:id/unblock', authorize(PERMISSIONS.ORG_BLOCK), asyncHandler(controller.unblock));

router.post(
  '/:id/reset-admin-password',
  authorize(PERMISSIONS.ORG_RESET_ADMIN_PASSWORD),
  validateRequest(resetOrganizationAdminPasswordSchema),
  asyncHandler(controller.setAdminPassword)
);

router.post('/:id/resend-invite', authorize(PERMISSIONS.ORG_RESEND_INVITE), asyncHandler(controller.resendInvite));
router.post('/:id/cancel-invite', authorize(PERMISSIONS.ORG_CANCEL_INVITE), asyncHandler(controller.cancelInvite));

router.post(
  '/:id/upgrade-plan',
  authorize(PERMISSIONS.ORG_UPGRADE_PLAN),
  validateRequest(upgradePlanSchema),
  asyncHandler(controller.upgradePlan)
);
router.post(
  '/:id/assign-salesman',
  authorize(PERMISSIONS.ORG_ASSIGN_SALESMAN),
  validateRequest(assignSalesmanSchema),
  asyncHandler(controller.assignSalesman)
);

export default router;