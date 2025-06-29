import Image from "next/image"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { NewsArticleAny, NewsTranslation } from "@/lib/types/news"

interface NewsCardProps {
  article: NewsArticleAny
  language?: string
  className?: string
}

export default function NewsCard({ article, language = "vi", className = "" }: NewsCardProps) {
  const translation: NewsTranslation | undefined = (article as any).translations?.find?.((t: any) => t.language === language) || (article as any).NewsTranslation?.find?.((t: any) => t.language === language)
  const title = translation?.title ?? ""
  const date = new Date(article.published_at ?? article.published_at).toLocaleDateString()
  const categoryName = (article as any).category?.translations?.find?.((t: any) => t.language === language)?.name || (article as any).NewsCategory?.translations?.find?.((t: any)=>t.language === language)?.name || ""
  const image = article.main_image
  const id = article.id
  return (
    <Link href={`/news/${id}`}>
      <div className={`bg-white rounded-lg overflow-hidden shadow-md h-full transition-all hover:shadow-lg hover:-translate-y-1 ${className}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarDays className="w-3 h-3 mr-1" />
              <span className="text-xs">{date}</span>
            </div>
            {categoryName && <span className="text-xs text-[#00b764]">{categoryName}</span>}
          </div>
          <h3 className="font-bold line-clamp-2 hover:text-[#00b764] transition-colors">{title}</h3>
        </div>
      </div>
    </Link>
  )
} 