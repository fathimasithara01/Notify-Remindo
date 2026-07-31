import { Router } from "express";
import { container } from "tsyringe";
import { SubscriptionPlanController } from "../controllers/subscription.controller";
import { FeatureController } from "../controllers/feature.controller";
import { PlanFeatureController } from "../controllers/plan-feature.controller";
import { OrganizationSubscriptionController } from "../controllers/organization-subscription.controller";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

const subscriptionPlanController = container.resolve(SubscriptionPlanController);
const featureController = container.resolve(FeatureController);
const planFeatureController = container.resolve(PlanFeatureController);
const organizationSubscriptionController = container.resolve(OrganizationSubscriptionController);

router.post("/", requireAuth, authorize("plan.create"), subscriptionPlanController.createPlan);
router.get("/", requireAuth, authorize("plan.view"), subscriptionPlanController.listPlans);
router.get("/:id", requireAuth, authorize("plan.view"), subscriptionPlanController.getPlanById);
router.patch("/:id", requireAuth, authorize("plan.edit"), subscriptionPlanController.updatePlan);
router.delete("/:id",requireAuth,authorize("plan.delete"),subscriptionPlanController.deletePlan);

router.post("/features",requireAuth,authorize("plan.create"),featureController.createFeature);
router.get( "/features",  requireAuth, authorize("plan.view"), featureController.listFeatures);
router.get("/features/:id",requireAuth,authorize("plan.view"), featureController.getFeatureById);
router.patch("/features/:id",requireAuth,authorize("plan.edit"),featureController.updateFeature);
router.delete("/features/:id", requireAuth, authorize("plan.delete"), featureController.deleteFeature);

router.post("/plans/:planId/features",requireAuth,authorize("plan.edit"),planFeatureController.addPlanFeature);
router.get( "/plans/:planId/features", requireAuth, authorize("plan.view"), planFeatureController.listPlanFeatures);
router.delete( "/plans/:planId/features/:featureId", requireAuth,  authorize("plan.edit"),  planFeatureController.removePlanFeature);

router.post( "/organization-subscriptions", requireAuth, authorize("subscription.create"), organizationSubscriptionController.createSubscription);
router.get( "/organizations/:organizationId/subscriptions/active",requireAuth,authorize("subscription.view"),organizationSubscriptionController.getActiveSubscription);
router.get( "/organizations/:organizationId/subscriptions", requireAuth, authorize("subscription.view"), organizationSubscriptionController.listSubscriptionHistory);
router.patch("/organization-subscriptions/:id/renew",requireAuth,authorize("subscription.edit"),organizationSubscriptionController.renewSubscription);
router.patch(  "/organization-subscriptions/:id/cancel",  requireAuth,  authorize("subscription.cancel"),  organizationSubscriptionController.cancelSubscription);

export default router;