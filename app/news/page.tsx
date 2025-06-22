import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight } from "lucide-react"
import { getTranslations } from "@/lib/i18n"
import NewsCategoryTabs from "./news-category-tabs"
import NewsCard from "./news-card"

export default function NewsPage() {
  const t = getTranslations()

  // Mock news data - this would be fetched from an API in a real app
  const featuredNews = {
    id: "1",
    title: "CHI MA HTT KHẲNG ĐỊNH SỰ MINH BẠCH VÀ VĂN HÓA ỨNG XỬ TRÊN CÁC PHƯƠNG TIỆN TRUYỀN THÔNG",
    date: "04/06/2025",
    category: t.eventsNews,
    image: "/img/new1.png",
    excerpt: "Sau bức thư thứ nhất gửi ngày 30.5.2025 đã được Quý cổ đông, đối tác và cán bộ nhân viên cũng như Quý Công chúng hiểu về tinh thần trách nhiệm và quyết tâm của Chi Ma HTT trong việc tham gia đầu tư Dự án...",
  }

  const newsItems = [
    {
      id: "2",
      title: "CÁCH XÁC ĐỊNH VỊ TRÍ CONTAINER TRÊN TÀU",
      date: "18/06/2025",
      category: t.industryNews,
      image: "/img/new2.png",
    },
    {
      id: "3",
      title: "CẢNG QUỐC TẾ CHU LAI ĐƯA VÀO VẬN HÀNH TÀU LAI DẮT CHU LAI PORT 02",
      date: "04/06/2025",
      category: t.eventsNews,
      image: "/img/new3.png",
    },
    {
      id: "4",
      title: "INCOTERMS LÀ GÌ VÀ CÓ Ý NGHĨA NHƯ THẾ NÀO?",
      date: "03/06/2025",
      category: t.industryNews,
      image: "/img/service1.png",
    },
    {
      id: "5",
      title: "CBNV CHI MA HTT TÍCH CỰC LAO ĐỘNG SÁNG TẠO",
      date: "03/06/2025",
      category: t.internalNews,
      image: "/img/service2.png",
    },
    {
      id: "6",
      title: "THƯ CỦA CHỦ TỊCH HĐQT VỀ VIỆC ĐỀ XUẤT ĐẦU TƯ DỰ ÁN ĐƯỜNG SẮT TỐC ĐỘ CAO BẮC – NAM",
      date: "30/05/2025",
      category: t.eventsNews,
      image: "/img/service3.png",
    },
    {
      id: "7",
      title: "TÌM HIỂU Ý NGHĨA CỦA MÀU SẮC CONTAINER TRONG VẬN TẢI BIỂN",
      date: "28/05/2025",
      category: t.knowledgeNews,
      image: "/img/service4.png",
    },
    {
      id: "8",
      title: "CHI MA HTT CÔNG BỐ MỞ TUYẾN HÀNG HẢI TRỰC TIẾP CHI MA – ẤN ĐỘ",
      date: "21/05/2025",
      category: t.eventsNews,
      image: "/img/service5.png",
    },
    {
      id: "9",
      title: "CHI MA HTT VẬN CHUYỂN HÀNG VIỆN TRỢ QUỐC TẾ",
      date: "09/05/2025",
      category: t.internalNews,
      image: "/img/service6.png",
    },
  ]

  const hotNews = [
    {
      id: "10",
      title: "2025 – KỶ NGUYÊN MỚI CỦA CÁC LIÊN MINH HÀNG HẢI",
      date: "11/03/2025",
      category: t.knowledgeNews,
      image: "/img/why1.png",
    },
    {
      id: "11",
      title: "TÌM HIỂU KHO HÀNG QUY MÔ LỚN TẠI MIỀN TRUNG",
      date: "03/03/2025",
      category: t.knowledgeNews,
      image: "/img/why2.png",
    },
    {
      id: "12",
      title: "HỆ THỐNG KHO CHUẨN QUỐC TẾ",
      date: "25/02/2025",
      category: t.knowledgeNews,
      image: "/img/why3.png",
    },
    {
      id: "13",
      title: "CHỈ SỐ LPI – LOGISTICS PERFORMANCE INDEX",
      date: "15/02/2025",
      category: t.knowledgeNews,
      image: "/img/why4.png",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      {/* Banner */}
      <div className="relative w-full h-64 mb-12 rounded-lg overflow-hidden">
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
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#009f56]">{t.newsPageTitle}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main featured news - larger size */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative h-80 w-full">
              <Image 
                src={featuredNews.image} 
                alt={featuredNews.title} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                <span className="bg-[#e8f5ee] text-[#00b764] px-3 py-1 rounded-full text-xs">
                  {featuredNews.category}
                </span>
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <span>{featuredNews.date}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{featuredNews.title}</h3>
              <p className="text-gray-600 mb-4">{featuredNews.excerpt}</p>
              <Link href={`/news/${featuredNews.id}`}>
                <Button className="bg-[#00b764] hover:bg-[#009f56] text-white">
                  {t.readMore} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* News categories tabs (client component) */}
          <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
            <NewsCategoryTabs 
              categories={{
                all: t.allNews,
                events: t.eventsNews,
                internal: t.internalNews,
                industry: t.industryNews
              }}
            />
          </div>
        </div>
      </div>

      {/* News grid */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item) => (
            <NewsCard 
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              category={item.category}
              image={item.image}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button className="bg-white text-[#00b764] border border-[#00b764] hover:bg-[#e8f5ee]">
            {t.viewMore}
          </Button>
        </div>
      </div>

      {/* Hot news section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#009f56]">{t.hotNews}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotNews.map((item) => (
            <NewsCard 
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              category={item.category}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {/* Link to services */}
      <div className="bg-[#f8f8f8] rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">{t.moreServiceInfo}</h3>
        <p className="text-gray-600 mb-6">
          {t.moreServiceInfoDesc}
        </p>
        <div className="flex justify-center gap-4">
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