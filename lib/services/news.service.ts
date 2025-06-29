import { buildQuery } from "@/lib/utils/query";
import { PaginationResult } from "@/lib/types/pagination";
import { NewsArticleAny } from "@/lib/types/news";
import { apiClient } from "./api.service";
import { CrudService } from "./crud.service";

class NewsService extends CrudService<NewsArticleAny> {
  protected endpoint = "/news";
  protected authenticated = true; // create/update/delete need auth; list/detail remain public

  // Override list to accept params & return paginated result
  async list(params: {
    language?: string;
    page?: number;
    pageSize?: number;
    categoryId?: number;
    slug?: string;
    excludeId?: number;
  } = {}): Promise<PaginationResult<NewsArticleAny>> {
    const query = buildQuery(params);
    const res = await apiClient.get<any>(`${this.endpoint}${query}`, false);
    return res.data ? res as PaginationResult<NewsArticleAny> : res;
  }

  // Override detail to support language param
  async detail(id: number | string, language = "vi"): Promise<NewsArticleAny> {
    const query = buildQuery({ language });
    const res = await apiClient.get<any>(`${this.endpoint}/${id}${query}`, false);
    return res.data ?? res;
  }

  // Helper to fetch by slug
  async detailBySlug(slug: string, language = "vi"): Promise<NewsArticleAny | null> {
    const { data } = await this.list({ language, slug, pageSize: 1 });
    return data[0] ?? null;
  }
}

export const newsService = new NewsService();
export default newsService; 