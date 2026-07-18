import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { createOrganizationSchema, upgradePlanSchema, assignSalesmanSchema, blockCustomerSchema, addContactPersonSchema, } from '../validators/organization.validator';
import { asyncHandler } from '../../shared/utils/async-handler';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';


const router = Router();

router.use(requireAuth);

const controller = container.resolve<OrganizationController>(TOKENS.OrganizationController);

router.post('/',authorize('organization.create'),validateRequest(createOrganizationSchema),asyncHandler(controller.create));
router.get('/', authorize('organization.view'), asyncHandler(controller.list));
router.get('/:id', authorize('organization.view'), asyncHandler(controller.getOne));

router.post('/:id/block',authorize('organization.block'),validateRequest(blockCustomerSchema),asyncHandler(controller.block));
router.post('/:id/unblock', authorize('organization.block'), asyncHandler(controller.unblock));
router.post('/:id/upgrade-plan',authorize('organization.upgrade_plan'),validateRequest(upgradePlanSchema),asyncHandler(controller.upgradePlan));
router.post( '/:id/assign-salesman', authorize('organization.assign_salesman'), validateRequest(assignSalesmanSchema), asyncHandler(controller.assignSalesman));

router.post('/:id/contacts',authorize('organization.edit'),validateRequest(addContactPersonSchema),asyncHandler(controller.addContactPerson));
router.get('/:id/contacts',authorize('organization.view'),asyncHandler(controller.listContactPersons));

export default router;