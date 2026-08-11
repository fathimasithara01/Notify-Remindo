import { Router } from "express";
import { container } from "tsyringe";
import { SubscriptionPlanController } from "../controllers/subscription.controller";
import { FeatureController } from "../controllers/feature.controller";
import { PlanFeatureController } from "../controllers/plan-feature.controller";
import { OrganizationSubscriptionController } from "../controllers/organization-subscription.controller";
import { authenticate } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constant";

const router = Router();

const subscriptionPlanController = container.resolve(SubscriptionPlanController);
const featureController = container.resolve(FeatureController);
const planFeatureController = container.resolve(PlanFeatureController);
const organizationSubscriptionController = container.resolve(OrganizationSubscriptionController);

router.use(authenticate);

router.post("/", authorize(PERMISSIONS.PLAN_CREATE), subscriptionPlanController.createPlan);
router.get("/", authorize(PERMISSIONS.PLAN_VIEW), subscriptionPlanController.listPlans);

router.post("/features", authorize(PERMISSIONS.PLAN_CREATE), featureController.createFeature);
router.get("/features", authorize(PERMISSIONS.PLAN_VIEW), featureController.listFeatures);
router.get("/features/:id", authorize(PERMISSIONS.PLAN_VIEW), featureController.getFeatureById);
router.patch("/features/:id", authorize(PERMISSIONS.PLAN_UPDATE), featureController.updateFeature);
router.delete("/features/:id", authorize(PERMISSIONS.PLAN_DELETE), featureController.deleteFeature);

router.post("/plans/:planId/features", authorize(PERMISSIONS.PLAN_UPDATE), planFeatureController.addPlanFeature);
router.get("/plans/:planId/features", authorize(PERMISSIONS.PLAN_VIEW), planFeatureController.listPlanFeatures);
router.delete("/plans/:planId/features/:featureId", authorize(PERMISSIONS.PLAN_UPDATE), planFeatureController.removePlanFeature);

router.post("/organization-subscriptions", authorize(PERMISSIONS.SUBSCRIPTION_CREATE), organizationSubscriptionController.createSubscription);
router.get("/organizations/:organizationId/subscriptions/active", authorize(PERMISSIONS.SUBSCRIPTION_VIEW), organizationSubscriptionController.getActiveSubscription);
router.get("/organizations/:organizationId/subscriptions", authorize(PERMISSIONS.SUBSCRIPTION_VIEW), organizationSubscriptionController.listSubscriptionHistory);
router.patch("/organization-subscriptions/:id/renew", authorize(PERMISSIONS.SUBSCRIPTION_UPDATE), organizationSubscriptionController.renewSubscription);
router.patch("/organization-subscriptions/:id/cancel", authorize(PERMISSIONS.SUBSCRIPTION_CANCEL), organizationSubscriptionController.cancelSubscription);

router.get("/:id", authorize(PERMISSIONS.PLAN_VIEW), subscriptionPlanController.getPlanById);
router.patch("/:id", authorize(PERMISSIONS.PLAN_UPDATE), subscriptionPlanController.updatePlan);
router.delete("/:id", authorize(PERMISSIONS.PLAN_DELETE), subscriptionPlanController.deletePlan);

export default router;