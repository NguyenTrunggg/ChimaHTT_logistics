import { Router } from "express";
import { JobArticleController } from "../controllers/job-article.controller";
import { authenticateJWT, authorizePermissions } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", JobArticleController.findAll);
router.get("/:id", JobArticleController.findOne);

// Protected routes
router.post(
  "/",
  authenticateJWT,
  authorizePermissions("job.create"),
  JobArticleController.create
);

router.put(
  "/:id",
  authenticateJWT,
  authorizePermissions("job.update"),
  JobArticleController.update
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizePermissions("job.delete"),
  JobArticleController.delete
);

export default router; 