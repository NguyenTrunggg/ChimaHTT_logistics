
import { Router } from "express";
import { ServiceArticleController } from "../controllers/service-article.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

// POST /service-articles (chỉ cho phép admin, editor)
router.post(
  "/service-articles",
  authenticateJWT,
  authorizeRoles("admin", "editor"),
  ServiceArticleController.create
);

export default router;
