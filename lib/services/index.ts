// Export all services
export * from "./api.service";
export * from "./auth.service";
export * from "./crud.service";
export * from "./config.service";
export * from "./permission.service";
export * from "./permission-api.service";
export * from "./role.service";
export * from "./user.service";
export * from "./news.service";
export * from "./job.service";
export * from "./service.service";
export * from "./upload.service";
export * from "./container.service";

// Export types
export type {
  LoginDto,
  LoginResponse,
  User,
  AuthState,
  ApiResponse,
  Permission,
} from "../types/auth";
export type { ApiRequestConfig } from "./api.service";
export type { AdminPermission } from "./permission.service";

// New domain types
export type { JobArticle } from "@/lib/types/job";
export type { NewsArticle } from "@/lib/types/news";
export type { LogisticService } from "@/lib/types/service";
export type { SystemConfig } from "@/lib/types/config";
export type { UserProfile, Role } from "@/lib/types/user";
export type { Container } from "@/lib/types/container";
