import { Router } from "express";
import { container } from "tsyringe";

import { SubscriptionPlanController } from "../controllers/subscription.controller";
import { FeatureController } from "../controllers/feature.controller";
import { PlanFeatureController } from "../controllers/plan-feature.controller";
import { OrganizationSubscriptionController } from "../controllers/organization-subscription.controller";

import { requireAuth } from '../middlewares/require-auth.middleware';
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

const subscriptionPlanController =
  container.resolve(SubscriptionPlanController);

const featureController =
  container.resolve(FeatureController);

const planFeatureController =
  container.resolve(PlanFeatureController);

const organizationSubscriptionController =
  container.resolve(OrganizationSubscriptionController);

  /*
|--------------------------------------------------------------------------
| Subscription Plan Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/plans",
  requireAuth,
  authorize("subscription:write"),
  subscriptionPlanController.createPlan
);

router.get(
  "/plans",
  requireAuth,
  authorize("subscription:read"),
  subscriptionPlanController.listPlans
);

router.get(
  "/plans/:id",
  requireAuth,
  authorize("subscription:read"),
  subscriptionPlanController.getPlanById
);

router.patch(
  "/plans/:id",
  requireAuth,
  authorize("subscription:write"),
  subscriptionPlanController.updatePlan
);

router.delete(
  "/plans/:id",
  requireAuth,
  authorize("subscription:write"),
  subscriptionPlanController.deletePlan
);

/*
|--------------------------------------------------------------------------
| Feature Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/features",
  requireAuth,
  authorize("subscription:write"),
  featureController.createFeature
);

router.get(
  "/features",
  requireAuth,
  authorize("subscription:read"),
  featureController.listFeatures
);

router.get(
  "/features/:id",
  requireAuth,
  authorize("subscription:read"),
  featureController.getFeatureById
);

router.patch(
  "/features/:id",
  requireAuth,
  authorize("subscription:write"),
  featureController.updateFeature
);

router.delete(
  "/features/:id",
  requireAuth,
  authorize("subscription:write"),
  featureController.deleteFeature
);


router.post(
  "/plans/:planId/features",
  requireAuth,
  authorize("subscription:write"),
  planFeatureController.addPlanFeature
);

router.get(
  "/plans/:planId/features",
  requireAuth,
  authorize("subscription:read"),
  planFeatureController.listPlanFeatures
);

router.delete(
  "/plans/:planId/features/:featureId",
  requireAuth,
  authorize("subscription:write"),
  planFeatureController.removePlanFeature
);

router.post(
  "/organization-subscriptions",
  requireAuth,
  authorize("subscription:write"),
  organizationSubscriptionController.createSubscription
);

router.get(
  "/organizations/:organizationId/subscriptions/active",
  requireAuth,
  authorize("subscription:read"),
  organizationSubscriptionController.getActiveSubscription
);

router.get(
  "/organizations/:organizationId/subscriptions",
  requireAuth,
  authorize("subscription:read"),
  organizationSubscriptionController.listSubscriptionHistory
);

router.patch(
  "/organization-subscriptions/:id/renew",
  requireAuth,
  authorize("subscription:write"),
  organizationSubscriptionController.renewSubscription
);

router.patch(
  "/organization-subscriptions/:id/cancel",
  requireAuth,
  authorize("subscription:write"),
  organizationSubscriptionController.cancelSubscription
);

export default router;