import { Router } from "express";
import { container } from "tsyringe";
import { FeatureController } from "../controllers/feature.controller";
import { authenticate } from "../middlewares/require-auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constant";
import { requirePermission } from "../middlewares/requirePermission.middleware";

const router = Router();
const controller = container.resolve(FeatureController);

router.use(authenticate);

router.post("/", requirePermission(PERMISSIONS.FEATURE_CREATE), controller.createFeature);
router.get("/", requirePermission(PERMISSIONS.FEATURE_VIEW), controller.listFeatures);
router.get("/:id", requirePermission(PERMISSIONS.FEATURE_VIEW), controller.getFeatureById);
router.patch("/:id", requirePermission(PERMISSIONS.FEATURE_UPDATE), controller.updateFeature);
router.delete("/:id", requirePermission(PERMISSIONS.FEATURE_DELETE), controller.deleteFeature);
router.post("/:id/block", requirePermission(PERMISSIONS.FEATURE_UPDATE), controller.blockFeature);
router.post("/:id/unblock", requirePermission(PERMISSIONS.FEATURE_UPDATE), controller.unblockFeature);

export default router;