import { Router } from "express";
import * as systemConfigController from "../controllers/system-config.controller";
import { authenticateJWT, authorizePermissions } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateJWT, authorizePermissions("system-config.read"), systemConfigController.listConfigs);
router.get("/:key", authenticateJWT, authorizePermissions("system-config.read"), systemConfigController.getConfig);
router.post("/", authenticateJWT, authorizePermissions("system-config.update"), systemConfigController.createConfig);
router.put("/:key", authenticateJWT, authorizePermissions("system-config.update"), systemConfigController.updateConfig);
router.delete("/:key", authenticateJWT, authorizePermissions("system-config.delete"), systemConfigController.deleteConfig);

export default router;
