import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight } from "lucide-react"
import { getTranslations } from "@/lib/i18n"
import NewsCategoryTabs from "./news-category-tabs"
import NewsCard from "./news-card"
import newsService from "@/lib/services/news.service"
import newsCategoryService from "@/lib/services/news-category.service"
import { NewsArticleAny } from "@/lib/types/news"

function getPrimaryTranslation(article: NewsArticleAny, lang: string = 'vi') {
  return (article as any).translations?.find?.((t: any) => t.language === lang) ||
         (article as any).NewsTranslation?.find?.((t: any) => t.language === lang) ||
         (article as any).translations?.[0] || (article as any).NewsTranslation?.[0];
}

function getCategoryName(article: NewsArticleAny, lang: string = 'vi') {
  const cat = (article as any).category || (article as any).NewsCategory;
  if (!cat) return '';
  return cat.translations?.find?.((t: any) => t.language === lang)?.name || cat.translations?.[0]?.name || '';
}

export default async function NewsPage({ searchParams }: {searchParams?: Record<string, string | string[]>}) {
  const langParam = (searchParams?.lang as string) || 'vi'
  const t = getTranslations(langParam as any)

  const lang: string = langParam
  const categoryId = searchParams?.categoryId ? Number(searchParams.categoryId) : undefined

  const [ { data: newsData }, categories ] = await Promise.all([
    newsService.list({ language: lang, page: 1, pageSize: 10, categoryId }),
    newsCategoryService.list(lang)
  ]);

  const featuredNews = newsData[0]
  const hotNews = newsData.slice(1, 6)

  return (
    <div className="container mx-auto py-12">
      {/* Banner */}
      <div className="relative w-full h-64 mb-16 rounded-lg overflow-hidden">
        <Image 
          src="/img/banner_about.png" 
          alt={t.newsPageTitle}
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">{t.newsPageTitle}</h1>
        </div>
      </div>

      {/* Featured news */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#009f56]">{t.newsPageTitle}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main featured news - larger size */}
          {featuredNews && (
            <div className="col-span-1 lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-80 w-full">
                <Image 
                  src={featuredNews.main_image} 
                  alt={getPrimaryTranslation(featuredNews, lang)?.title || ''} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  {getCategoryName(featuredNews, lang) && (
                    <span className="bg-[#e8f5ee] text-[#00b764] px-3 py-1 rounded-full text-xs">
                      {getCategoryName(featuredNews, lang)}
                    </span>
                  )}
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <span>{new Date(featuredNews.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{getPrimaryTranslation(featuredNews, lang)?.title}</h3>
                <Link href={`/news/${featuredNews.id}`}>
                  <Button className="bg-[#00b764] hover:bg-[#009f56] text-white">
                    {t.readMore} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Hot news sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-8 text-[#C14639]">{t.hotNews}</h3>
              <div>
                {hotNews.map((item, index) => (
                  <Link href={`/news/${item.id}`} key={item.id}>
                    <div className={`flex gap-5 group ${index !== hotNews.length - 1 ? 'mb-4' : ''}`}>
                      <div className="relative h-20 w-28 flex-shrink-0">
                        <Image 
                          src={item.main_image} 
                          alt={getPrimaryTranslation(item, lang)?.title || ''} 
                          fill 
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-base group-hover:text-[#00b764] line-clamp-2">
                          {getPrimaryTranslation(item, lang)?.title}
                        </h4>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <CalendarDays className="w-3 h-3 mr-1" />
                          <span>{new Date(item.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News category tabs (moved from above) */}
      <div className="mb-10">
        <NewsCategoryTabs categories={categories.map(c=>({id:c.id,name:c.translations[0]?.name||''}))} lang={lang} />
      </div>

      {/* News grid */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {newsData.map((article) => (
            <NewsCard key={article.id} article={article} language={lang} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="bg-white text-[#00b764] border border-[#00b764] hover:bg-[#e8f5ee]">
            {t.viewMore}
          </Button>
        </div>
      </div>

      {/* Link to services */}
      <div className="bg-[#f8f8f8] rounded-lg p-10 text-center">
        <h3 className="text-2xl font-bold mb-5">{t.moreServiceInfo}</h3>
        <p className="text-gray-600 mb-8">
          {t.moreServiceInfoDesc}
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/services">
            <Button className="bg-[#00b764] hover:bg-[#009f56] text-white">
              {t.viewServices}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-[#00b764] text-[#00b764] hover:bg-[#e8f5ee]">
              {t.contact}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 