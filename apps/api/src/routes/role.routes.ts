import { Router } from "express";
import RoleController from "../controllers/role.controller";
import {
  authenticateJWT,
  authorizePermissions,
} from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  authorizePermissions("role.create"),
  RoleController.create
);
router.get("/", authenticateJWT, authorizePermissions("role.read"), RoleController.list);
router.get(
  "/:id",
  authenticateJWT,
  authorizePermissions("role.read"),
  RoleController.getById
);
router.put(
  "/:id",
  authenticateJWT,
  authorizePermissions("role.update"),
  RoleController.update
);
router.delete(
  "/:id",
  authenticateJWT,
  authorizePermissions("role.delete"),
  RoleController.delete
);

export default router;
