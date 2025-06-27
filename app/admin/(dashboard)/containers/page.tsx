"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { containerService, Container } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  PackageCheck, 
  Filter,
  Truck,
  User,
  Calendar,
  MapPin,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import PageLayout from "@/components/admin/common/page-layout";

const ITEMS_PER_PAGE = 9;

export default function ContainersManagementPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "IMPORT" | "EXPORT">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await containerService.list("pageSize=100") as any;
        console.log("Containers API Response:", response); // Debug log
        // Handle both direct array and paginated response structure
        const containersData = Array.isArray(response) ? response : (response.data || []);
        setContainers(containersData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách container");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xoá container này?")) return;
    try {
      await containerService.remove(id);
      setContainers(containers.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and search containers - Add safety check
  const filteredContainers = useMemo(() => {
    if (!Array.isArray(containers)) {
      console.warn("Containers is not an array:", containers);
      return [];
    }
    return containers.filter((container) => {
      const matchesSearch = 
        container.containerNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === "ALL" || container.importExport === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [containers, searchQuery, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredContainers.length / ITEMS_PER_PAGE);
  const paginatedData = filteredContainers.slice(
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
      label: "Tổng Container",
      value: Array.isArray(containers) ? containers.length : 0,
      icon: <PackageCheck className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Import",
      value: Array.isArray(containers) ? containers.filter(c => c.importExport === "IMPORT").length : 0,
      icon: <Package className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      label: "Export", 
      value: Array.isArray(containers) ? containers.filter(c => c.importExport === "EXPORT").length : 0,
      icon: <Package className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      label: "Trong bãi",
      value: Array.isArray(containers) ? containers.filter(c => !c.yardOutDate).length : 0,
      icon: <MapPin className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    }
  ];

  // Additional filters
  const additionalFilters = (
    <div className="flex gap-2">
      {["ALL", "IMPORT", "EXPORT"].map((type) => (
        <Button
          key={type}
          variant={filterType === type ? "default" : "outline"}
          onClick={() => {
            setFilterType(type as any);
            setCurrentPage(1);
          }}
          className={`rounded-xl px-4 py-2 transition-all duration-200 ${
            filterType === type 
              ? "bg-gradient-to-r from-[#00b764] to-green-600 text-white shadow-lg" 
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4 mr-1" />
          {type === "ALL" ? "Tất cả" : type}
        </Button>
      ))}
    </div>
  );

  // Grid view render function
  const renderGridItem = (container: Container) => (
    <Card key={container.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <PackageCheck className="h-5 w-5 text-[#00b764]" />
            </div>
            <span className="truncate">{container.containerNumber}</span>
          </CardTitle>
          <Badge 
            variant={container.importExport === "IMPORT" ? "default" : "secondary"} 
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              container.importExport === "IMPORT" 
                ? "bg-blue-100 text-blue-700 border-blue-200" 
                : "bg-orange-100 text-orange-700 border-orange-200"
            }`}
          >
            {container.importExport === "IMPORT" ? "📥 IMPORT" : "📤 EXPORT"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Container Info */}
        <div className="space-y-3">
          {container.customer && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-gray-600">Khách hàng:</span>
              <span className="font-medium text-gray-800 truncate">{container.customer}</span>
            </div>
          )}
          
          {container.vehicleNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Số xe:</span>
              <span className="font-medium text-gray-800">{container.vehicleNumber}</span>
            </div>
          )}
          
          {container.serviceType && (
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Dịch vụ:</span>
              <span className="font-medium text-gray-800">{container.serviceType}</span>
            </div>
          )}
          
          {container.yardPosition && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="text-gray-600">Vị trí:</span>
              <span className="font-medium text-gray-800">{container.yardPosition}</span>
            </div>
          )}
          
          {container.yardInDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-gray-600">Vào bãi:</span>
              <span className="font-medium text-gray-800">
                {format(new Date(container.yardInDate), "dd/MM/yyyy", { locale: vi })}
              </span>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Cập nhật: {format(new Date(container.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${container.yardOutDate ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span>{container.yardOutDate ? 'Đã ra bãi' : 'Trong bãi'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button size="sm" variant="outline" className="flex-1 rounded-xl border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200" asChild>
            <Link href={`/admin/containers/${container.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" /> Sửa
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200" 
            onClick={() => handleDelete(container.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Xoá
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // List view render function
  const renderListItem = (container: Container) => (
    <Card key={container.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
              <PackageCheck className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {container.containerNumber}
                </h3>
                <Badge 
                  variant={container.importExport === "IMPORT" ? "default" : "secondary"} 
                  className={`w-fit ${
                    container.importExport === "IMPORT" 
                      ? "bg-blue-100 text-blue-700 border-blue-200" 
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}
                >
                  {container.importExport === "IMPORT" ? "📥 IMPORT" : "📤 EXPORT"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {container.customer && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-600">KH:</span>
                    <span className="font-medium text-gray-800 truncate">{container.customer}</span>
                  </div>
                )}
                
                {container.vehicleNumber && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Xe:</span>
                    <span className="font-medium text-gray-800">{container.vehicleNumber}</span>
                  </div>
                )}
                
                {container.yardPosition && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-gray-600">Vị trí:</span>
                    <span className="font-medium text-gray-800">{container.yardPosition}</span>
                  </div>
                )}
                
                {container.yardInDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="text-gray-600">Vào bãi:</span>
                    <span className="font-medium text-gray-800">
                      {format(new Date(container.yardInDate), "dd/MM/yyyy", { locale: vi })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${container.yardOutDate ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-gray-600">{container.yardOutDate ? 'Đã ra bãi' : 'Trong bãi'}</span>
                  </div>
                  <span className="text-gray-500">
                    Cập nhật: {format(new Date(container.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
              <Link href={`/admin/containers/${container.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
              onClick={() => handleDelete(container.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      title="Quản lý Container"
      description="Quản lý và theo dõi container nhập khẩu và xuất khẩu"
      addButtonText="Thêm Container"
      addButtonHref="/admin/containers/new"
      icon={<PackageCheck className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm kiếm theo số container, khách hàng, số xe..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={containers}
      filteredData={paginatedData}
      loading={loading}
      error={error}
      
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      
      stats={stats}
      renderGridItem={renderGridItem}
      renderListItem={renderListItem}
      additionalFilters={additionalFilters}
    />
  );
} 