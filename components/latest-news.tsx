"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { format } from "date-fns"

const news = [
  {
    id: 1,
    titleKey: "newsItem1Title",
    excerptKey: "newsItem1Excerpt",
    category: "companyNews",
    date: "2025-06-19",
    readTime: "3",
    author: "Eric Dương",
    image: "/img/new1.png",
  },
  {
    id: 2,
    titleKey: "newsItem2Title",
    excerptKey: "newsItem2Excerpt",
    category: "industryNews",
    date: "2025-06-19",
    readTime: "5",
    author: "Nguyễn Thành Trung",
    image: "/img/new2.png",
  },
  {
    id: 3,
    titleKey: "newsItem3Title",
    excerptKey: "newsItem3Excerpt",
    category: "recruitment",
    date: "2025-06-19",
    readTime: "2",
    author: "Trịnh Văn Đạo",
    image: "/img/new3.png",
  },
]

const categoryColors = {
  companyNews: "bg-[#00b764] text-white",
  industryNews: "bg-blue-500 text-white",
  recruitment: "bg-orange-500 text-white",
}

export function LatestNews() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("newsTitle")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("newsSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={t(article.titleKey as any)}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={categoryColors[article.category as keyof typeof categoryColors]}>
                  {t(article.category as any)}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-bold text-lg text-[#1a3b2f] line-clamp-2 group-hover:text-[#00b764] transition-colors">
                  {t(article.titleKey as any)}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{t(article.excerptKey as any)}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(article.date), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {article.readTime} {t("readTime")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/news">
            <Button className="bg-[#00b764] hover:bg-[#00b764]/90 text-white px-8 py-3">{t("viewAllNews")}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
