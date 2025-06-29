import { apiClient } from "./api.service";
import { buildQuery } from "@/lib/utils/query";

export interface NewsCategory {
  id: number;
  translations: { language: string; name: string }[];
}

class NewsCategoryService {
  private endpoint = "/news-categories";

  async list(language: string = "vi"): Promise<NewsCategory[]> {
    const query = buildQuery({ language });
    try {
      const res = await apiClient.get<any>(`${this.endpoint}${query}`);
      return res.data ?? res;
    } catch (err: any) {
      if (err.message?.includes('404')) return [];
      throw err;
    }
  }
}

export const newsCategoryService = new NewsCategoryService();
export default newsCategoryService; 