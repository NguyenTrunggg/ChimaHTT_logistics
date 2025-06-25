import { Request, Response } from "express";
import RoleService from "../services/role.service";

const RoleController = {
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const role = await RoleService.createRole(data);
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(Number(id));
      if (!role) return res.status(404).json({ message: "Not found" });
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const role = await RoleService.updateRole(Number(id), data);
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RoleService.deleteRole(Number(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async list(req: Request, res: Response) {
    try {
      const roles = await RoleService.listRoles(req.query);
      res.json(roles);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async addPermission(req: Request, res: Response) {
    try {
      const { roleId, permissionId } = req.body;
      const role = await RoleService.addPermissionToRole(
        Number(roleId),
        Number(permissionId)
      );
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async removePermission(req: Request, res: Response) {
    try {
      const { roleId, permissionId } = req.body;
      const role = await RoleService.removePermissionFromRole(
        Number(roleId),
        Number(permissionId)
      );
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default RoleController;
