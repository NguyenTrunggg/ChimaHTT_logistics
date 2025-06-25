import { Request, Response } from "express";
import { NewsService } from "../services/news.service";
import { z } from "zod";
import { getPagination } from "../utils/pagination";

// Validation schema
const NewsSchema = z.object({
  main_image: z.string(),
  category_id: z.number(),
  tag: z.string().optional(),
  title: z.string(),
  content: z.string(),
});

const service = new NewsService();

export class NewsController {
  static async create(req: Request, res: Response) {
    try {
      const parseResult = NewsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      // Get authorId from authenticated user
      const authorId = (req as any).user?.userId;
      if (!authorId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await service.create(authorId, parseResult.data);
      res.status(201).json({
        message: "News created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parseResult = NewsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.update(Number(id), parseResult.data);
      res.json({
        message: "News updated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { language = 'vi', categoryId } = req.query;
      const pagination = getPagination(req.query);
      
      const result = await service.findAll({
        ...pagination,
        language: language as string,
        categoryId: categoryId ? Number(categoryId) : undefined,
      });

      res.json({
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { language = 'vi' } = req.query;
      const result = await service.findOne(Number(id), language as string);
      if (!result) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json({
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(Number(id));
      res.json({
        message: "News deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 