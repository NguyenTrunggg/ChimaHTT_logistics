"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { newsService } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Newspaper, Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import PageLayout from "@/components/admin/common/page-layout";

const ITEMS_PER_PAGE = 9;

// Define proper type for the API response
interface NewsTranslation {
  id: number;
  news_id: number;
  language: string;
  title: string;
  content: string;
}

interface NewsCategory {
  id: number;
  translations: Array<{
    id: number;
    language: string;
    name: string;
    news_category_id: number;
  }>;
}

interface NewsUser {
  id: number;
  username: string;
}

interface NewsItem {
  id: number;
  main_image: string;
  published_at: string;
  author_id: number;
  tag?: string;
  category_id: number;
  User: NewsUser;
  NewsCategory: NewsCategory;
  NewsTranslation: NewsTranslation[];
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await newsService.list("?lang=vi") as any;
        console.log("API Response:", response); // Debug log
        // Handle both direct array and paginated response structure
        const newsData = Array.isArray(response) ? response : (response.data || []);
        setNews(newsData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách tin tức");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await newsService.remove(id);
      setNews(news.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa bài viết thất bại");
    }
  };

  // Filter and search news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // Use NewsTranslation array instead of translations
      const translation = item.NewsTranslation?.find((t: NewsTranslation) => t.language === "vi") || item.NewsTranslation?.[0];
      const matchesSearch = 
        translation?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation?.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [news, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedData = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Statistics
  const stats = [
    {
      label: "Tổng bài viết",
      value: news.length,
      icon: <Newspaper className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Đã xuất bản",
      value: news.filter(item => item.published_at).length,
      icon: <Eye className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      label: "Bản nháp",
      value: news.filter(item => !item.published_at).length,
      icon: <Edit className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-gray-500 to-gray-600"
    },
    {
      label: "Tháng này",
      value: news.filter(item => {
        if (!item.published_at) return false;
        const publishDate = new Date(item.published_at);
        const now = new Date();
        return publishDate.getMonth() === now.getMonth() && publishDate.getFullYear() === now.getFullYear();
      }).length,
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    }
  ];

  // Grid view render function
  const renderGridItem = (item: NewsItem) => {
    const translation = item.NewsTranslation?.find((t: NewsTranslation) => t.language === "vi") || item.NewsTranslation?.[0];
          return (
            <Card 
              key={item.id} 
        className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 group overflow-hidden rounded-2xl"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                    <Newspaper className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 text-lg leading-tight text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      {translation?.title || "Tiêu đề không có"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="relative overflow-hidden rounded-xl border border-gray-200 group-hover:border-green-300 transition-colors duration-300">
                  <img 
                    src={item.main_image || "/placeholder.jpg"} 
                    alt={translation?.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed min-h-[4rem]">
                    {translation?.content || "Nội dung không có"}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar className="h-3 w-3" />
                    <span>{item.published_at ? format(new Date(item.published_at), "dd MMMM yyyy", { locale: vi }) : "Chưa có ngày"}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl transition-all duration-200" 
                    asChild
                  >
              <Link href={`/admin/news/${item.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" /> 
                      Chỉnh sửa
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive" 
                    className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200" 
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
              </div>
            </CardContent>
          </Card>
          );
  };

  // List view render function
  const renderListItem = (item: NewsItem) => {
    const translation = item.NewsTranslation?.find((t: NewsTranslation) => t.language === "vi") || item.NewsTranslation?.[0];
    return (
      <Card key={item.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {translation?.title || "Tiêu đề không có"}
                  </h3>
                </div>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium text-gray-800">
                      {item.published_at ? format(new Date(item.published_at), "dd/MM/yyyy", { locale: vi }) : "Chưa có ngày"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {translation?.content || "Nội dung không có"}
                </p>
              </div>

              <div className="ml-4 w-24 h-16 rounded-lg overflow-hidden">
                <img 
                  src={item.main_image || "/placeholder.jpg"} 
                  alt={translation?.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
                <Link href={`/admin/news/${item.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
      </div>
    </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <PageLayout
      title="Quản lý Tin tức"
      description="Quản lý và xuất bản bài viết tin tức"
      addButtonText="Thêm Tin tức"
      addButtonHref="/admin/news/new"
      icon={<Newspaper className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm kiếm theo tiêu đề, nội dung..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={news}
      filteredData={paginatedData}
      loading={loading}
      error={error}
      
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      
      stats={stats}
      renderGridItem={renderGridItem}
      renderListItem={renderListItem}
    />
  );
}
