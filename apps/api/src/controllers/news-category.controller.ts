import { Request, Response } from "express";
import { NewsCategoryService } from "../services/news-category.service";

const service = new NewsCategoryService();

export class NewsCategoryController {
  static async findAll(req: Request, res: Response) {
    try {
      const { language = 'vi' } = req.query;
      const data = await service.findAll(language as string);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
} 