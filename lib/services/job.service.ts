import { CrudService } from "./crud.service";
import { JobArticle } from "@/lib/types/job";
import { buildQuery } from "@/lib/utils/query";
import { PaginationResult } from "@/lib/types/pagination";
import { apiClient } from "./api.service";

class JobService extends CrudService<JobArticle> {
  protected endpoint = "/jobs";
  // Jobs list is public, but create/update/delete require auth (handled by CrudService default)

  // list with params
  async list(params: {
    language?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  } = {}): Promise<PaginationResult<JobArticle>> {
    const query = buildQuery(params);
    const res = await apiClient.get<any>(`${this.endpoint}${query}`, false);
    return res.data ? res as PaginationResult<JobArticle> : res;
  }

  async detail(id:number|string, language="vi"):Promise<JobArticle>{
    const query = buildQuery({ language});
    const res = await apiClient.get<any>(`${this.endpoint}/${id}${query}`, false);
    return res.data ?? res;
  }
}

export const jobService = new JobService();
export default jobService; 