import { Router } from "express";
import { container } from "tsyringe";

import { SubscriptionPlanController } from "../controllers/subscription.controller";
import { FeatureController } from "../controllers/feature.controller";
import { PlanFeatureController } from "../controllers/plan-feature.controller";
import { OrganizationSubscriptionController } from "../controllers/organization-subscription.controller";

import { requireAuth } from "../middlewares/require-auth.middleware";
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


// ===============================
// Subscription Plan Management
// ===============================

// Create Plan
router.post(
  "/plans",
  requireAuth,
  authorize("plan.create"),
  subscriptionPlanController.createPlan
);


// List Plans
router.get(
  "/plans",
  requireAuth,
  authorize("plan.view"),
  subscriptionPlanController.listPlans
);


// Get Single Plan
router.get(
  "/plans/:id",
  requireAuth,
  authorize("plan.view"),
  subscriptionPlanController.getPlanById
);


// Update Plan
router.patch(
  "/plans/:id",
  requireAuth,
  authorize("plan.edit"),
  subscriptionPlanController.updatePlan
);


// Delete Plan
router.delete(
  "/plans/:id",
  requireAuth,
  authorize("plan.delete"),
  subscriptionPlanController.deletePlan
);


// Create Feature
router.post(
  "/features",
  requireAuth,
  authorize("plan.create"),
  featureController.createFeature
);


// List Features
router.get(
  "/features",
  requireAuth,
  authorize("plan.view"),
  featureController.listFeatures
);


// Get Feature
router.get(
  "/features/:id",
  requireAuth,
  authorize("plan.view"),
  featureController.getFeatureById
);


// Update Feature
router.patch(
  "/features/:id",
  requireAuth,
  authorize("plan.edit"),
  featureController.updateFeature
);


// Delete Feature
router.delete(
  "/features/:id",
  requireAuth,
  authorize("plan.delete"),
  featureController.deleteFeature
);



// Add Feature To Plan
router.post(
  "/plans/:planId/features",
  requireAuth,
  authorize("plan.edit"),
  planFeatureController.addPlanFeature
);


// List Plan Features
router.get(
  "/plans/:planId/features",
  requireAuth,
  authorize("plan.view"),
  planFeatureController.listPlanFeatures
);


// Remove Plan Feature
router.delete(
  "/plans/:planId/features/:featureId",
  requireAuth,
  authorize("plan.edit"),
  planFeatureController.removePlanFeature
);


// Create Organization Subscription
router.post(
  "/organization-subscriptions",
  requireAuth,
  authorize("subscription.create"),
  organizationSubscriptionController.createSubscription
);


// Get Active Subscription
router.get(
  "/organizations/:organizationId/subscriptions/active",
  requireAuth,
  authorize("subscription.view"),
  organizationSubscriptionController.getActiveSubscription
);


// Subscription History
router.get(
  "/organizations/:organizationId/subscriptions",
  requireAuth,
  authorize("subscription.view"),
  organizationSubscriptionController.listSubscriptionHistory
);


// Renew Subscription
router.patch(
  "/organization-subscriptions/:id/renew",
  requireAuth,
  authorize("subscription.edit"),
  organizationSubscriptionController.renewSubscription
);


// Cancel Subscription
router.patch(
  "/organization-subscriptions/:id/cancel",
  requireAuth,
  authorize("subscription.cancel"),
  organizationSubscriptionController.cancelSubscription
);


export default router;