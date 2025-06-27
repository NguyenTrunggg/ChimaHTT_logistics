import { CrudService } from "./crud.service";
import { UserProfile } from "@/lib/types/user";
import { apiClient } from "./api.service";

class UserService extends CrudService<UserProfile, number> {
  protected endpoint = "/users";
  protected authenticated = true;

  /**
   * Change user role
   */
  async changeRole(id: number | string, roleId: number | string) {
    return apiClient.patch<UserProfile>(`${this.endpoint}/${id}/role`, { roleId }, true);
  }
}

export const userService = new UserService();
export default userService; 