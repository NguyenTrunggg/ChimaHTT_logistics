import { CrudService } from "./crud.service";
import { JobArticle } from "@/lib/types/job";

class JobService extends CrudService<JobArticle> {
  protected endpoint = "/jobs";
  // Jobs list is public, but create/update/delete require auth (handled by CrudService default)
}

export const jobService = new JobService();
export default jobService; 