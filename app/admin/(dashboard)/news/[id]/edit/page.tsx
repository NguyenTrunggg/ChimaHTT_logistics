"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { newsService, NewsArticle } from "@/lib/services";
import NewsForm from "@/components/admin/news/news-form";
import { ArrowLeft, Loader2, Newspaper, Edit, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock categories - in real app, fetch from API
  const categories: { id: number; name: string }[] = [
    { id: 1, name: "Tin tức chung" },
    { id: 2, name: "Thông báo" },
    { id: 3, name: "Sự kiện" },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsId = parseInt(id);
        if (isNaN(newsId)) throw new Error("ID không hợp lệ");
        const data = await newsService.detail(newsId);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải bài viết tin tức");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Loading Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="p-2 h-auto hover:bg-white/80 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                    Đang tải...
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Đang tải thông tin bài viết
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
          <p className="text-gray-600 font-medium">Đang tải thông tin bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Error Header */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-2xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/admin/news")} 
                className="p-2 h-auto hover:bg-white/80 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại danh sách
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-700 bg-clip-text text-transparent">
                    Có lỗi xảy ra
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Không thể tải thông tin bài viết
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center py-20 space-y-6">
          <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Lỗi tải dữ liệu</h2>
            <p className="text-red-600">{error}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Thử lại
            </Button>
            <Button onClick={() => router.push("/admin/news")} className="bg-gradient-to-r from-[#00b764] to-green-600">
              Về danh sách tin tức
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="p-2 h-auto hover:bg-white/80 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </Button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Newspaper className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                  Chỉnh sửa bài viết
                </h1>
                <p className="text-gray-600 mt-1">
                  {article.NewsTranslation?.[0]?.title || "Tiêu đề bài viết"}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">ID:</span>
                <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                  {article.id}
                </code>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <Edit className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <NewsForm initialData={article} categories={categories} />
    </div>
  );
} 