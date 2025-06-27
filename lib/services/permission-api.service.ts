import { apiClient } from "./api.service";
import { Permission } from "@/lib/types/user";

class PermissionApiService {
  /**
   * GET /roles/permissions - Get all available permissions
   */
  async list(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>("/roles/permissions", true);
    return Array.isArray(response) ? response : response.data || [];
  }
}

export const permissionApiService = new PermissionApiService();
export default permissionApiService; 