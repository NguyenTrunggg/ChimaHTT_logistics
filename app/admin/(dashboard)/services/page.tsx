"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { servicesService } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Wrench, Settings, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/admin/common/page-layout";

const ITEMS_PER_PAGE = 9;

// Define proper type for the API response
interface ServiceTranslation {
  id: number;
  service_id: number;
  language: string;
  title: string;
  content: string;
  features?: Record<string, any>;
}

interface ServiceItem {
  id: number;
  main_image: string;
  ServiceTranslation: ServiceTranslation[];
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await servicesService.list("?language=vi") as any;
        console.log("Services API Response:", response); // Debug log
        // Handle both direct array and paginated response structure
        const servicesData = Array.isArray(response) ? response : (response.data || []);
        setServices(servicesData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách dịch vụ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xoá dịch vụ này?")) return;
    try {
      await servicesService.remove(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and search services - Add safety check and use ServiceTranslation
  const filteredServices = useMemo(() => {
    if (!Array.isArray(services)) {
      console.warn("Services is not an array:", services);
      return [];
    }
    return services.filter((service) => {
      // Use ServiceTranslation array instead of translations
      const translation = service.ServiceTranslation?.find((t: ServiceTranslation) => t.language === "vi") || service.ServiceTranslation?.[0];
      const matchesSearch = 
        translation?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation?.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [services, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedData = filteredServices.slice(
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

  // Statistics with safety checks
  const stats = [
    {
      label: "Tổng dịch vụ",
      value: Array.isArray(services) ? services.length : 0,
      icon: <Settings className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Có hình ảnh",
      value: Array.isArray(services) ? services.filter(s => s.main_image).length : 0,
      icon: <Wrench className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      label: "Logistics",
      value: Array.isArray(services) ? services.filter(s => {
        const translation = s.ServiceTranslation?.find((t: ServiceTranslation) => t.language === "vi") || s.ServiceTranslation?.[0];
        return translation?.title?.toLowerCase().includes('logistics');
      }).length : 0,
      icon: <Wrench className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      label: "Tháng này",
      value: Array.isArray(services) ? services.length : 0, // Placeholder since we don't have date info
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
  ];

  // Grid view render function
  const renderGridItem = (service: ServiceItem) => {
    const translation = service.ServiceTranslation?.find((t: ServiceTranslation) => t.language === "vi") || service.ServiceTranslation?.[0];
    return (
      <Card key={service.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Wrench className="h-5 w-5 text-[#00b764]" />
            </div>
            <span className="line-clamp-2 text-ellipsis">{translation?.title || "Tên dịch vụ không có"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 group-hover:border-green-300 transition-colors duration-300">
            <img 
              src={service.main_image || "/placeholder.jpg"} 
              alt={translation?.title} 
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[4.5rem] leading-relaxed">
            {translation?.content || "Nội dung không có"}
          </p>
          
          {/* Features display if available */}
          {translation?.features && Object.keys(translation.features).length > 0 && (
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <div className="text-xs font-medium text-blue-700 mb-2">Tính năng:</div>
              <div className="flex flex-wrap gap-1">
                {Object.values(translation.features).slice(0, 3).map((feature, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                    {String(feature)}
                  </span>
                ))}
                {Object.keys(translation.features).length > 3 && (
                  <span className="text-xs text-blue-600">+{Object.keys(translation.features).length - 3} khác</span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button size="sm" variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl transition-all duration-200" asChild>
              <Link href={`/admin/services/${service.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" /> Sửa
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200"
              onClick={() => handleDelete(service.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Xoá
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // List view render function
  const renderListItem = (service: ServiceItem) => {
    const translation = service.ServiceTranslation?.find((t: ServiceTranslation) => t.language === "vi") || service.ServiceTranslation?.[0];
    return (
      <Card key={service.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {translation?.title || "Tên dịch vụ không có"}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {translation?.content || "Nội dung không có"}
                </p>

                {/* Features display for list view */}
                {translation?.features && Object.keys(translation.features).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.values(translation.features).slice(0, 5).map((feature, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                        {String(feature)}
                      </span>
                    ))}
                    {Object.keys(translation.features).length > 5 && (
                      <span className="text-xs text-blue-600">+{Object.keys(translation.features).length - 5}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="ml-4 w-24 h-16 rounded-lg overflow-hidden">
                <img 
                  src={service.main_image || "/placeholder.jpg"} 
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
                <Link href={`/admin/services/${service.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
                onClick={() => handleDelete(service.id)}
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
      title="Quản lý Dịch vụ"
      description="Quản lý các dịch vụ logistics và vận chuyển"
      addButtonText="Thêm Dịch vụ"
      addButtonHref="/admin/services/new"
      icon={<Wrench className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm kiếm theo tên dịch vụ, nội dung..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={services}
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
