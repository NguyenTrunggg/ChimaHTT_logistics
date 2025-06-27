"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Users,
  Eye,
  TrendingUp,
  Filter,
  Calendar,
  Building,
  DollarSign
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { jobService, JobArticle } from "@/lib/services";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/admin/common/page-layout";

const ITEMS_PER_PAGE = 9;

export default function CareersManagementPage() {
  // State
  const [jobs, setJobs] = useState<JobArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.list("?lang=vi");
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách tuyển dụng");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => {
        const translation = job.translations.find(t => t.language === "vi") || job.translations[0];
        return translation?.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               translation?.job_location?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(job => {
        const translation = job.translations.find(t => t.language === "vi") || job.translations[0];
        return translation?.job_location === locationFilter;
      });
    }

    return filtered;
  }, [jobs, searchQuery, statusFilter, locationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedData = filteredJobs.slice(
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

  const renderPostedDistance = (dateIso?: string) => {
    if (!dateIso) return "";
    return formatDistanceToNow(new Date(dateIso), { addSuffix: true, locale: vi });
  };

  // Statistics
  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter(job => job.status === "published").length;
  const draftJobs = jobs.filter(job => job.status === "draft").length;
  const recentJobs = jobs.filter(job => {
    if (!job.created_at) return false;
    const diffTime = Date.now() - new Date(job.created_at).getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  // Get unique locations
  const uniqueLocations = Array.from(new Set(
    jobs.map(job => {
      const translation = job.translations.find(t => t.language === "vi") || job.translations[0];
      return translation?.job_location;
    }).filter(Boolean)
  ));

  const handleDelete = async (jobId: number) => {
    if (confirm('Bạn chắc chắn muốn xóa tin tuyển dụng này?')) {
      try {
        await jobService.remove(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  // Statistics
  const stats = [
    {
      label: "Tổng tin tuyển dụng",
      value: totalJobs,
      icon: <Briefcase className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Đã công bố",
      value: publishedJobs,
      icon: <Eye className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      label: "Bản nháp",
      value: draftJobs,
      icon: <Edit className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-gray-500 to-gray-600"
    },
    {
      label: "Mới trong tuần",
      value: recentJobs,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    }
  ];

  // Additional filters
  const additionalFilters = (
    <div className="flex gap-4">
      <Select value={statusFilter} onValueChange={(value) => {
        setStatusFilter(value);
        setCurrentPage(1);
      }}>
        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 w-40">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="published">Đã công bố</SelectItem>
          <SelectItem value="draft">Bản nháp</SelectItem>
        </SelectContent>
      </Select>

      <Select value={locationFilter} onValueChange={(value) => {
        setLocationFilter(value);
        setCurrentPage(1);
      }}>
        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 w-40">
          <SelectValue placeholder="Địa điểm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả địa điểm</SelectItem>
          {uniqueLocations.map((location) => (
            <SelectItem key={location} value={location!}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Grid view render function
  const renderGridItem = (job: JobArticle) => {
    const translation = job.translations.find((t) => t.language === "vi") || job.translations[0];
    return (
      <Card key={job.id} className="border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white to-green-50 hover:to-green-100">
        <CardContent className="p-6">
          <div className="flex flex-col lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl group-hover:shadow-lg transition-all duration-300">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:items-start gap-2">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    {translation?.job_title || "(Chưa có tiêu đề)"}
                  </h3>
                  <Badge
                    variant={job.status === "published" ? "default" : "secondary"}
                    className={job.status === "published" 
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm" 
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 shadow-sm"
                    }
                  >
                    {job.status === "published" ? "Đã công bố" : "Bản nháp"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{translation?.job_location || "Chưa có địa điểm"}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{renderPostedDistance(job.created_at)}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{job.created_at ? format(new Date(job.created_at), "dd/MM/yyyy", { locale: vi }) : ""}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
              <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
                <Link href={`/admin/careers/${job.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
                onClick={() => handleDelete(job.id)}
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

  // List view render function  
  const renderListItem = (job: JobArticle) => {
    const translation = job.translations.find((t) => t.language === "vi") || job.translations[0];
    return (
      <Card key={job.id} className="border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white to-green-50 hover:to-green-100">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl group-hover:shadow-lg transition-all duration-300">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    {translation?.job_title || "(Chưa có tiêu đề)"}
                  </h3>
                  <Badge
                    variant={job.status === "published" ? "default" : "secondary"}
                    className={job.status === "published" 
                      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm" 
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-300 shadow-sm"
                    }
                  >
                    {job.status === "published" ? "Đã công bố" : "Bản nháp"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{translation?.job_location || "Chưa có địa điểm"}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{renderPostedDistance(job.created_at)}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{job.created_at ? format(new Date(job.created_at), "dd/MM/yyyy", { locale: vi }) : ""}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-lg border border-blue-200">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">0 ứng viên</span>
                    </span>
                    <span className="flex items-center gap-1 bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-1.5 rounded-lg border border-orange-200">
                      <Eye className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-700">0 lượt xem</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
              <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
                <Link href={`/admin/careers/${job.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
                onClick={() => handleDelete(job.id)}
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
      title="Quản lý Tuyển dụng"
      description="Quản lý tin tuyển dụng và theo dõi ứng viên"
      addButtonText="Đăng tin tuyển dụng mới"
      addButtonHref="/admin/careers/new"
      icon={<Briefcase className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm theo vị trí, địa điểm..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={jobs}
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
