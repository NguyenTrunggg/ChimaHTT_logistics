import { Request, Response } from "express";
import { ServiceService } from "../services/service.service";
import { z } from "zod";
import { getPagination } from "../utils/pagination";

// Validation schema
const ServiceSchema = z.object({
  main_image: z.string(),
  title: z.string(),
  content: z.string(),
  features: z.record(z.any()),
});

const service = new ServiceService();

export class ServiceController {
  static async create(req: Request, res: Response) {
    try {
      const parseResult = ServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.create(parseResult.data);
      res.status(201).json({
        message: "Service created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parseResult = ServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.update(Number(id), parseResult.data);
      res.json({
        message: "Service updated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const { language = 'vi' } = req.query;
      const pagination = getPagination(req.query);

      const result = await service.findAll(language as string, pagination);
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
        return res.status(404).json({ message: "Service not found" });
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
        message: "Service deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 