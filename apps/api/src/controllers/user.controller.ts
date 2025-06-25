import { Request, Response } from "express";
import UserService from "../services/user.service";

const UserController = {
  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await UserService.createUser(data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));
      if (!user) return res.status(404).json({ message: "Not found" });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await UserService.updateUser(Number(id), data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(Number(id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async list(req: Request, res: Response) {
    try {
      const users = await UserService.listUsers(req.query);
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  async changeRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      const user = await UserService.changeUserRole(Number(id), Number(roleId));
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default UserController;
