import { CrudService } from "./crud.service";
import { LogisticService } from "@/lib/types/service";

class ServicesService extends CrudService<LogisticService> {
  protected endpoint = "/services";
}

export const servicesService = new ServicesService();
export default servicesService; 