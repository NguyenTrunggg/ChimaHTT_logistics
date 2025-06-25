import { Router } from "express";
import UserController from "../controllers/user.controller";
import {
  authenticateJWT,
  authorizePermissions,
} from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  authorizePermissions("user.create"),
  UserController.create
);
router.get("/", authenticateJWT, authorizePermissions("user.read"), UserController.list);
router.get(
  "/:id",
  authenticateJWT,
  authorizePermissions("user.read"),
  UserController.getById
);
router.put(
  "/:id",
  authenticateJWT,
  authorizePermissions("user.update"),
  UserController.update
);
router.delete(
  "/:id",
  authenticateJWT,
  authorizePermissions("user.delete"),
  UserController.delete
);
router.patch(
  "/:id/role",
  authenticateJWT,
  authorizePermissions("user.update"),
  UserController.changeRole
);

export default router;
