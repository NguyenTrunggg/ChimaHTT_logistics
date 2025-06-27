import { Router } from "express";
import { ContainerController } from "../controllers/container.controller";
import { authenticateJWT, authorizePermissions } from "../middlewares/auth.middleware";

const router = Router();

// Public route for customers to track container by number
router.get("/track", ContainerController.findPublic);

// Public route for customers to track container by vehicle number
router.get("/track-vehicle", ContainerController.findByVehicle);

// Admin routes (protected)
router.use(authenticateJWT); // Apply auth to all routes below
router.use(authorizePermissions("container.read")); // Apply read permission

router.get("/", ContainerController.findAll);
router.get("/:id", ContainerController.findOne);

// Admin write operations (need additional permissions)
router.post("/", authorizePermissions("container.create"), ContainerController.create);
router.put("/:id", authorizePermissions("container.update"), ContainerController.update);
router.delete("/:id", authorizePermissions("container.delete"), ContainerController.delete);

export default router; 