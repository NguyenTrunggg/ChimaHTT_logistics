import { Router } from "express";
import { NewsController } from "../controllers/news.controller";
import { authenticateJWT, authorizePermissions } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", NewsController.findAll);
router.get("/:id", NewsController.findOne);

// Protected routes
router.post(
  "/",
  authenticateJWT,
  authorizePermissions("news.create"),
  NewsController.create
);

router.put(
  "/:id",
  authenticateJWT,
  authorizePermissions("news.update"),
  NewsController.update
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizePermissions("news.delete"),
  NewsController.delete
);

export default router; 