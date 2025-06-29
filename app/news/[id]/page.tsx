import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { getTranslations } from "@/lib/i18n"
import newsService from "@/lib/services/news.service"
import { NewsArticleAny } from "@/lib/types/news"
import { marked } from 'marked'

interface NewsDetailPageProps {
  params: {
    id: string
  }
  searchParams?: Record<string,string|string[]>
}

function getPrimaryTranslation(article: NewsArticleAny, lang: string = 'vi') {
  return (article as any).translations?.find?.((t: any) => t.language === lang) || (article as any).NewsTranslation?.find?.((t: any) => t.language === lang) || (article as any).translations?.[0] || (article as any).NewsTranslation?.[0]
}

function getCategoryName(article: NewsArticleAny, lang: string = 'vi') {
  const cat = (article as any).category || (article as any).NewsCategory
  if (!cat) return ''
  return cat.translations?.find?.((t: any) => t.language === lang)?.name || cat.translations?.[0]?.name || ''
}

function markdownToHtml(md: string): string {
  marked.setOptions({ breaks: true, gfm: true })
  const html = marked(md || '') as string
  return html
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4 text-gray-800">')
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-3 text-gray-800">')
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2 text-gray-800">')
    .replace(/<p>/g, '<p class="mb-3 text-gray-700 leading-relaxed">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-1">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-1">')
    .replace(/<li>/g, '<li class="text-gray-700">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-green-500 pl-4 italic my-4 text-gray-600">')
    .replace(/<a href/g, '<a class="text-blue-600 hover:underline" href')
    .replace(/<img/g, '<img class="max-w-full h-auto rounded-lg shadow-md my-4"')
    .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">')
    .replace(/<code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">')
}

export default async function NewsDetailPage({ params, searchParams }: NewsDetailPageProps) {
  const { id } = params
  const langParam = (searchParams?.lang as string) || 'vi'
  const t = getTranslations(langParam as any)
  const lang = langParam

  const article = await newsService.detail(id, lang)
  if (!article) {
    // TODO: Return 404 component
    return <div>Not found</div>
  }

  const translation = getPrimaryTranslation(article, lang)

  // Fetch related news by category (exclude current id)
  const { data: relatedNews } = await newsService.list({ language: lang, categoryId: (article as any).category_id || (article as any).category?.id || (article as any).NewsCategory?.id, pageSize: 3, excludeId: article.id })

  return (
    <div className="container mx-auto py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="ghost" className="text-[#00b764] hover:text-[#009f56] hover:bg-[#e8f5ee] px-0">
            <ChevronLeft className="h-4 w-4 mr-2" /> {t.backToNews}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative h-96 w-full">
            <Image 
              src={article.main_image} 
              alt={translation?.title || ''} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              {getCategoryName(article, lang) && (
                <span className="bg-[#e8f5ee] text-[#00b764] px-3 py-1 rounded-full text-xs">
                  {getCategoryName(article, lang)}
                </span>
              )}
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>{new Date(article.published_at as any).toLocaleDateString()}</span>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-6">{translation?.title}</h1>
            
            {/* Author */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-gray-600">{t.author}: <span className="font-medium">{(article as any).User?.username || 'Admin'}</span></p>
            </div>
            
            {/* Content */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(translation?.content || '') }} />
            
            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3">{t.tags}:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tag && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {article.tag}
                  </span>
                )}
              </div>
            </div>
            
            {/* Share */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3">{t.share}:</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          {/* Related news */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#009f56]">{t.relatedNews}</h3>
            <div className="space-y-8">
              {relatedNews.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id}>
                  <div className="flex gap-3 group">
                    <div className="relative h-16 w-24 flex-shrink-0">
                      <Image 
                        src={item.main_image} 
                        alt={getPrimaryTranslation(item, lang)?.title || ''} 
                        fill 
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-[#00b764] line-clamp-2">
                        {getPrimaryTranslation(item, lang)?.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{new Date(item.published_at as any).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Latest news */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#009f56]">{t.latestNews}</h3>
            <div className="space-y-4">
              {relatedNews.map((item) => (
                <Link href={`/news/${item.id}`} key={`latest-${item.id}`}>
                  <div className="flex gap-3 group">
                    <div className="relative h-16 w-24 flex-shrink-0">
                      <Image 
                        src={item.main_image} 
                        alt={getPrimaryTranslation(item, lang)?.title || ''} 
                        fill 
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-[#00b764] line-clamp-2">
                        {getPrimaryTranslation(item, lang)?.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{new Date(item.published_at as any).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/news">
                <Button className="bg-[#00b764] hover:bg-[#009f56] text-white w-full">
                  {t.viewAllNews}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Contact sidebar */}
          <div className="bg-[#e8f5ee] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3 text-[#00b764]">{t.needConsultation}</h3>
            <p className="text-gray-600 text-sm mb-4">
              {t.contactForConsultation}
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#00b764] flex items-center justify-center text-white">
                  📞
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hotline</p>
                  <p className="font-medium">0933 800 555</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#00b764] flex items-center justify-center text-white">
                  ✉️
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">contact@chimahtt.com.vn</p>
                </div>
              </div>
            </div>
            <Link href="/contact">
              <Button className="w-full bg-[#00b764] hover:bg-[#009f56] text-white">
                {t.contact}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 