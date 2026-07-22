import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TOKENS } from '../../infrastructure/di/tokens';
import { SubscriptionController } from '../controllers/subscription.controller';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { createPlanSchema, editPlanSchema, createFeatureSchema, editFeatureSchema, setPlanFeatureSchema } from '../validators/subscription.validator';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = container.resolve<SubscriptionController>(TOKENS.SubscriptionController);

router.use(requireAuth);

router.post(
  '/plans',
  authorize('plan.create'),
  validateRequest(createPlanSchema),
  asyncHandler(controller.createPlan)
);
router.get('/plans', authorize('plan.view'), asyncHandler(controller.listPlans));
router.get('/plans/:id', authorize('plan.view'), asyncHandler(controller.getPlan));
router.patch(
  '/plans/:id',
  authorize('plan.edit'),
  validateRequest(editPlanSchema),
  asyncHandler(controller.updatePlan)
);
router.delete('/plans/:id', authorize('plan.delete'), asyncHandler(controller.deletePlan));

router.post(
  '/plans/:id/features',
  authorize('plan.edit'),
  validateRequest(setPlanFeatureSchema),
  asyncHandler(controller.setPlanFeature)
);
router.delete(
  '/plans/:id/features/:featureId',
  authorize('plan.edit'),
  asyncHandler(controller.removePlanFeature)
);

router.post(
  '/features',
  authorize('feature.create'),
  validateRequest(createFeatureSchema),
  asyncHandler(controller.createFeature)
);
router.get('/features', authorize('feature.view'), asyncHandler(controller.listFeatures));
router.patch(
  '/features/:id',
  authorize('feature.edit'),
  validateRequest(editFeatureSchema),
  asyncHandler(controller.updateFeature)
);
router.delete('/features/:id', authorize('feature.delete'), asyncHandler(controller.deleteFeature));


// add
// GET /features/:id
export default router;