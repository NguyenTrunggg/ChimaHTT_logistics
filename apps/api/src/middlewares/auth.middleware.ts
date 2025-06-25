import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../config/prisma";

export interface AuthRequest extends Request {
  user?: { userId: number; role: number };
}

export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret)
    return res.status(500).json({ message: "JWT secret not configured" });
  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
      userId: number;
      role: number;
    };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Permission-based authorization middleware
export function authorizePermissions(requiredPermissions: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const [subject, action] = requiredPermissions.split(".");

    try {
      // Get user with role and check permission directly in query
      const user = await prisma.user.findFirst({
        where: { 
          id: req.user.userId,
          role: {
            permissions: {
              some: {
                AND: [
                  { action: action },
                  { subject: subject }
                ]
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(403).json({ message: "You don't have permission to perform this action" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error checking permissions" });
    }
  };
}
