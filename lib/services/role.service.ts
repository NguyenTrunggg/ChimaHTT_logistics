import { CrudService } from "./crud.service";
import { Role } from "@/lib/types/user";

class RoleService extends CrudService<Role> {
  protected endpoint = "/roles";
  protected authenticated = true;
}

export const roleService = new RoleService();
export default roleService; 