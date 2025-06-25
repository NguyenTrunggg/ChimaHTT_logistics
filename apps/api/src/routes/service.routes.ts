import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authenticateJWT, authorizePermissions } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", ServiceController.findAll);
router.get("/:id", ServiceController.findOne);

// Protected routes
router.post(
  "/", 
  authenticateJWT,
  authorizePermissions("service.create"),
  ServiceController.create
);

router.put(
  "/:id",
  authenticateJWT,
  authorizePermissions("service.update"),
  ServiceController.update
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizePermissions("service.delete"),
  ServiceController.delete
);

export default router; 