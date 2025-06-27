import { CrudService } from "./crud.service";
import { NewsArticle } from "@/lib/types/news";

class NewsService extends CrudService<NewsArticle> {
  protected endpoint = "/news";
}

export const newsService = new NewsService();
export default newsService; 