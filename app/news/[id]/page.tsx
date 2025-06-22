import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { getTranslations } from "@/lib/i18n"

// This would typically be fetched from a database or API
const getNewsById = (id: string) => {
  // For demo purposes, we'll return a mock article
  return {
    id: id,
    title: "CHI MA HTT KHẲNG ĐỊNH SỰ MINH BẠCH VÀ VĂN HÓA ỨNG XỬ TRÊN CÁC PHƯƠNG TIỆN TRUYỀN THÔNG",
    date: "04/06/2025",
    category: "TIN TỨC SỰ KIỆN",
    image: "/img/new1.png",
    content: `
      <p>Sau bức thư thứ nhất gửi ngày 30.5.2025 đã được Quý cổ đông, đối tác và cán bộ nhân viên cũng như Quý Công chúng hiểu về tinh thần trách nhiệm và quyết tâm của Chi Ma HTT trong việc tham gia đầu tư Dự án Đường sắt tốc độ cao Bắc – Nam. Hôm nay, Ban Lãnh đạo Chi Ma HTT xin gửi đến Quý cổ đông, đối tác và cán bộ nhân viên bức thư thứ hai nhằm khẳng định sự minh bạch và văn hóa ứng xử của Chi Ma HTT trên các phương tiện truyền thông.</p>
      <p>Trong thời gian qua, có một số thông tin trên mạng xã hội nói về Chi Ma HTT và cá nhân Chủ tịch HĐQT Chi Ma HTT không chính xác, thậm chí có dấu hiệu xuyên tạc, vu khống, làm ảnh hưởng đến uy tín của Chi Ma HTT và Chủ tịch HĐQT Chi Ma HTT.</p>
      <p>Chi Ma HTT là doanh nghiệp tư nhân lớn với hơn 20 năm xây dựng và phát triển, hoạt động đa ngành sản xuất kinh doanh, trọng tâm là nông nghiệp, lâm nghiệp, công nghiệp ô tô và cơ khí, logistics - cảng biển và bất động sản. Đặc biệt, Chi Ma HTT là một trong những doanh nghiệp tư nhân lớn đã tham gia đầu tư vào lĩnh vực giao thông kết cấu hạ tầng với các dự án BOT giao thông, trong đó có dự án BOT đầu tiên của Chi Ma HTT là BOT Quốc lộ 1 đoạn tránh thành phố Biên Hòa đã được đưa vào khai thác sử dụng năm 2015, đến nay đã vận hành được gần 10 năm.</p>
      <h3>TINH THẦN VÀ TRÁCH NHIỆM CÔNG DÂN</h3>
      <p>Với vai trò là doanh nghiệp tư nhân lớn của đất nước, Chi Ma HTT và Chủ tịch HĐQT Chi Ma HTT luôn thể hiện tinh thần và trách nhiệm công dân, không chỉ chấp hành nghiêm túc pháp luật, đóng góp đầy đủ nghĩa vụ thuế mà còn tích cực tham gia các hoạt động xã hội, chia sẻ lợi ích với cộng đồng.</p>
      <p>Trong quá trình hoạt động, Chi Ma HTT luôn ứng xử có văn hóa với các cơ quan quản lý nhà nước, các đối tác kinh doanh, và đặc biệt với các đối thủ cạnh tranh. Chi Ma HTT cam kết cạnh tranh lành mạnh, minh bạch và tuân thủ pháp luật.</p>
      <h3>CAM KẾT CỦA CHI MA HTT</h3>
      <p>1. Chi Ma HTT sẽ tiếp tục hoạt động với tinh thần trách nhiệm cao nhất, đặt lợi ích quốc gia, cộng đồng lên trên lợi ích của doanh nghiệp.</p>
      <p>2. Chi Ma HTT cam kết minh bạch trong mọi hoạt động, tuân thủ nghiêm túc các quy định của pháp luật.</p>
      <p>3. Chi Ma HTT luôn phối hợp chặt chẽ với các cơ quan chức năng để làm rõ bất kỳ vấn đề nào liên quan đến hoạt động của Chi Ma HTT khi được yêu cầu.</p>
      <p>4. Chi Ma HTT sẽ tiếp tục đầu tư vào các dự án phát triển kinh tế - xã hội của đất nước, tạo công ăn việc làm, đóng góp vào ngân sách nhà nước.</p>
      <p>Chi Ma HTT tin tưởng rằng, với sự ủng hộ của Quý cổ đông, đối tác và cán bộ nhân viên, cùng với tinh thần trách nhiệm và quyết tâm của toàn thể Chi Ma HTT, chúng tôi sẽ vượt qua mọi thách thức, tiếp tục phát triển bền vững và đóng góp tích cực cho sự phát triển của đất nước.</p>
      <p>Trân trọng!</p>
      <p>Thay mặt Ban Lãnh đạo Chi Ma HTT</p>
    `,
    author: "Ban Lãnh đạo Chi Ma HTT",
    tags: ["Thông báo", "Minh bạch", "Trách nhiệm xã hội"],
  }
}

// We'll also show related news
const relatedNews = [
  {
    id: "3",
    title: "CẢNG QUỐC TẾ CHU LAI ĐƯA VÀO VẬN HÀNH TÀU LAI DẮT CHU LAI PORT 02",
    date: "04/06/2025",
    category: "TIN TỨC SỰ KIỆN",
    image: "/img/new3.png",
  },
  {
    id: "6",
    title: "THƯ CỦA CHỦ TỊCH HĐQT VỀ VIỆC ĐỀ XUẤT ĐẦU TƯ DỰ ÁN ĐƯỜNG SẮT TỐC ĐỘ CAO BẮC – NAM",
    date: "30/05/2025",
    category: "TIN TỨC SỰ KIỆN",
    image: "/img/service3.png",
  },
  {
    id: "8",
    title: "CHI MA HTT CÔNG BỐ MỞ TUYẾN HÀNG HẢI TRỰC TIẾP CHI MA – ẤN ĐỘ",
    date: "21/05/2025",
    category: "TIN TỨC SỰ KIỆN",
    image: "/img/service5.png",
  },
]

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = params
  const news = getNewsById(id)
  const t = getTranslations()

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
              src={news.image} 
              alt={news.title} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <span className="bg-[#e8f5ee] text-[#00b764] px-3 py-1 rounded-full text-xs">
                {news.category}
              </span>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>{news.date}</span>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-6">{news.title}</h1>
            
            {/* Author */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-gray-600">{t.author}: <span className="font-medium">{news.author}</span></p>
            </div>
            
            {/* Content */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
            
            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-3">{t.tags}:</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
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
            <div className="space-y-4">
              {relatedNews.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id}>
                  <div className="flex gap-3 group">
                    <div className="relative h-16 w-24 flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-[#00b764] line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{item.date}</span>
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
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-[#00b764] line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        <span>{item.date}</span>
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