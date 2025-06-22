import Image from "next/image"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

interface NewsCardProps {
  id: string
  title: string
  date: string
  category: string
  image: string
  className?: string
}

export default function NewsCard({ id, title, date, category, image, className = "" }: NewsCardProps) {
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
            <span className="text-xs text-[#00b764]">{category}</span>
          </div>
          <h3 className="font-bold line-clamp-2 hover:text-[#00b764] transition-colors">{title}</h3>
        </div>
      </div>
    </Link>
  )
} 