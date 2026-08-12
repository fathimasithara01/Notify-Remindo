import { Router } from "express";
import { container } from "tsyringe";
import { SubscriptionPlanController } from "../controllers/subscription.controller";
import { authenticate } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constant";

const router = Router();
const controller = container.resolve(SubscriptionPlanController);

router.use(authenticate);

router.post("/", authorize(PERMISSIONS.PLAN_CREATE), controller.createPlan);
router.get("/", authorize(PERMISSIONS.PLAN_VIEW), controller.listPlans);
router.get("/:id", authorize(PERMISSIONS.PLAN_VIEW), controller.getPlanById);
router.patch("/:id", authorize(PERMISSIONS.PLAN_UPDATE), controller.updatePlan);
router.delete("/:id", authorize(PERMISSIONS.PLAN_DELETE), controller.deletePlan);
router.patch("/:id/block", authorize(PERMISSIONS.PLAN_UPDATE), controller.blockPlan);
router.patch("/:id/unblock", authorize(PERMISSIONS.PLAN_UPDATE), controller.unblockPlan);

export default router;