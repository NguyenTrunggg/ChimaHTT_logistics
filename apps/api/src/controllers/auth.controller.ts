import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    await authService.changePassword(username, oldPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { username, newPassword } = req.body;
    await authService.resetPassword(username, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await authService.me(token);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

