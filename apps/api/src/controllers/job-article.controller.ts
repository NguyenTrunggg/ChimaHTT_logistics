import { Request, Response } from "express";
import { JobArticleService } from "../services/job-article.service";
import { z } from "zod";
import { getPagination } from "../utils/pagination";
import { ArticleStatus } from "@prisma/client";

// Validation schema
const JobArticleSchema = z.object({
  primary_image: z.string(),
  status: z.nativeEnum(ArticleStatus),
  job_deadline: z.string().transform(str => new Date(str)),
  job_title: z.string(),
  job_position: z.string(),
  job_location: z.string(),
  job_benefits: z.string().optional(),
  job_description: z.string().optional(),
  job_requirements: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  content: z.string().optional(),
  slug: z.string().optional(),
});

const service = new JobArticleService();

export class JobArticleController {
  static async create(req: Request, res: Response) {
    try {
      const parseResult = JobArticleSchema.safeParse(req.body);
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
        message: "Job article created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parseResult = JobArticleSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.update(Number(id), parseResult.data);
      res.json({
        message: "Job article updated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { language = 'vi', status } = req.query;
      const pagination = getPagination(req.query);
      
      const result = await service.findAll({
        ...pagination,
        language: language as string,
        status: status as ArticleStatus | undefined,
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
        return res.status(404).json({ message: "Job article not found" });
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
        message: "Job article deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 