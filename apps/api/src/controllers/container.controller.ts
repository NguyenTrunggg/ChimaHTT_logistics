import { Request, Response } from "express";
import { ContainerService } from "../services/container.service";
import { z } from "zod";
import { getPagination } from "../utils/pagination";

const service = new ContainerService();

// Validation schema
const ContainerSchema = z.object({
  weight: z.number().optional(),
  vehicle_number: z.string().optional(),
  container_number: z.string(),
  customer: z.string().optional(),
  import_export: z.enum(["IMPORT", "EXPORT"]),
  shipping_line: z.string().optional(),
  seal: z.string().optional(),
  service_type: z.string().optional(),
  yard_in_date: z.coerce.date().optional(),
  yard_out_date: z.coerce.date().optional(),
  yard_position: z.string().optional(),
  note: z.string().optional(),
});

export class ContainerController {
  // Admin: create
  static async create(req: Request, res: Response) {
    try {
      const parseResult = ContainerSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.create(parseResult.data);
      res.status(201).json({
        message: "Container created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Admin: update
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parseResult = ContainerSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.flatten(),
        });
      }

      const result = await service.update(Number(id), parseResult.data);
      res.json({
        message: "Container updated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Admin: list with pagination
  static async findAll(req: Request, res: Response) {
    try {
      const pagination = getPagination(req.query);
      const { containerNumber, customer, vehicleNumber } = req.query as any;
      const result = await service.findAll({
        ...pagination,
        containerNumber,
        customer,
        vehicleNumber,
      });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Public: find by containerNumber
  static async findPublic(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Missing query ?q=containerNumber" });
      }
      const result = await service.findByContainerNumber(q);
      if (!result) {
        return res.status(404).json({ message: "Container not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Public: find by vehicle number
  static async findByVehicle(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Missing query ?q=vehicleNumber" });
      }
      const result = await service.findByVehicleNumber(q);
      if (!result) {
        return res.status(404).json({ message: "Container not found" });
      }
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Admin: find one by id
  static async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await service.findOne(Number(id));
      if (!result) {
        return res.status(404).json({ message: "Container not found" });
      }
      res.json({ data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Admin: delete
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.delete(Number(id));
      res.json({ message: "Container deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 