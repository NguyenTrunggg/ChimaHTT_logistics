import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  Loader2
} from "lucide-react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import Link from "next/link";

interface PageLayoutProps {
  title: string;
  description?: string;
  addButtonText: string;
  addButtonHref: string;
  icon: React.ReactNode;
  
  // Search & Filter
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // View Toggle
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  
  // Data
  data: any[];
  filteredData: any[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  
  // Stats (optional)
  stats?: Array<{
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }>;
  
  // Render functions
  renderGridItem: (item: any) => React.ReactNode;
  renderListItem: (item: any) => React.ReactNode;
  
  // Additional filters (optional)
  additionalFilters?: React.ReactNode;
  
  children?: React.ReactNode;
}

export default function PageLayout({
  title,
  description,
  addButtonText,
  addButtonHref,
  icon,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  viewMode,
  onViewModeChange,
  data,
  filteredData,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  stats,
  renderGridItem,
  renderListItem,
  additionalFilters,
  children
}: PageLayoutProps) {
  // Calculate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) range.push(i);
        range.push('ellipsis');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1);
        range.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) range.push(i);
      } else {
        range.push(1);
        range.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) range.push(i);
        range.push('ellipsis');
        range.push(totalPages);
      }
    }
    
    return range;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-20 border-red-200 bg-red-50">
        <CardContent className="text-center py-10">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (!data.length) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              {icon}
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-gray-600 text-lg">Chưa có dữ liệu nào được tạo.</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-[#00b764] to-green-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200">
              <Link href={addButtonHref}>
                <Plus className="h-5 w-5 mr-2" /> {addButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
          <p className="text-gray-600">
            Tổng cộng <span className="font-semibold text-green-600">{filteredData.length}</span> mục
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-[#00b764] to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200">
          <Link href={addButtonHref}>
            <Plus className="h-5 w-5 mr-2" /> {addButtonText}
          </Link>
        </Button>
      </div>

      {/* Stats Cards (if provided) */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-xl shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filter Section */}
      <Card className="border border-gray-200 shadow-lg bg-gradient-to-r from-white to-gray-50 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-200 transition-all duration-200"
              />
            </div>
            
            {/* Additional Filters */}
            {additionalFilters}
            
            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-200 rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className={`rounded-lg transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-[#00b764] to-green-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className={`rounded-lg transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-[#00b764] to-green-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      {filteredData.length === 0 && data.length > 0 ? (
        <Card className="border-orange-200 bg-orange-50 rounded-2xl">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-orange-800">Không tìm thấy kết quả</h3>
                <p className="text-orange-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm dữ liệu.
                </p>
              </div>
              <Button
                onClick={() => onSearchChange("")}
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Grid/List View */}
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredData.map((item) => 
              viewMode === "grid" ? renderGridItem(item) : renderListItem(item)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-green-50"}
                    />
                  </PaginationItem>
                  
                  {getPaginationRange().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => onPageChange(page as number)}
                          isActive={currentPage === page}
                          className={`cursor-pointer ${
                            currentPage === page 
                              ? "bg-green-600 text-white hover:bg-green-700" 
                              : "hover:bg-green-50"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-green-50"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {children}
    </div>
  );
} 