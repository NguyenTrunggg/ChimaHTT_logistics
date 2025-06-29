"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface JobTranslation {
  job_title: string;
  job_position: string;
  job_location: string;
  content?: string;
}

interface Job {
  id: string;
  title: string | { [key: string]: string };
  department: string | { [key: string]: string };
  location: string | { [key: string]: string };
  dueDate: string;
  job_deadline: string;
  isHot?: boolean;
  status: string;
  primary_image?: string;
  translations: JobTranslation[];
}

interface FilterOption {
  id: string;
  label: { vi: string; en: string; cn: string };
}

export default function CareersPage() {
  const { t, locale } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { jobService } = await import("@/lib/services/job.service");
        const { data = [] } = await jobService.list({ 
          language: locale, 
          status: "published", 
          pageSize: 100 
        });

        // Normalize shape for convenient rendering & filtering
        const normalized: Job[] = (Array.isArray(data) ? data : []).map((job: any) => {
          const translation = (Array.isArray(job.translations) && job.translations[0]) || {};

          return {
            ...job,
            title: typeof job.title === "object" || job.title 
              ? job.title 
              : { [locale]: translation.job_title || "No title" },
            department: typeof job.department === "object" || job.department
              ? job.department
              : { [locale]: translation.job_position || "No department" },
            location: typeof job.location === "object" || job.location
              ? job.location
              : { [locale]: translation.job_location || "No location" },
            dueDate: job.dueDate || job.job_deadline || "No deadline",
          };
        });

        setJobListings(normalized);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          locale === "vi" 
            ? "Không thể tải danh sách việc làm. Vui lòng thử lại sau."
            : locale === "en"
            ? "Unable to load job listings. Please try again later."
            : "无法加载职位列表。请稍后重试。"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [locale]);

  // Helper function to get localized text
  const getLocalizedText = (text: string | { [key: string]: string }): string => {
    if (typeof text === "string") return text;
    return text?.[locale] || text?.vi || text?.en || "N/A";
  };

  // Helper function to normalize text for filtering
  const normalizeForFilter = (text: string): string => {
    return text.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '');
  };

  // Generate dynamic filter options from actual job data
  const getDynamicFilterOptions = (): {
    departments: FilterOption[];
    locations: FilterOption[];
    positions: FilterOption[];
  } => {
    const departmentSet = new Set<string>();
    const locationSet = new Set<string>();
    const positionSet = new Set<string>();

    jobListings.forEach(job => {
      const dept = getLocalizedText(job.department);
      const loc = getLocalizedText(job.location);
      const title = getLocalizedText(job.title);

      if (dept && dept !== "N/A") departmentSet.add(dept);
      if (loc && loc !== "N/A") locationSet.add(loc);
      
      // Extract position level from title
      if (title.includes("Giám đốc") || title.includes("Director")) {
        positionSet.add("director");
      } else if (title.includes("Trưởng phòng") || title.includes("Manager") || title.includes("Trưởng")) {
        positionSet.add("manager");
      } else if (title.includes("Phó") || title.includes("Deputy")) {
        positionSet.add("deputy");
      } else {
        positionSet.add("staff");
      }
    });

    // Base options
    const allDept = { id: "all", label: { vi: "Tất cả ngành nghề", en: "All Departments", cn: "所有部门" } };
    const allLoc = { id: "all", label: { vi: "Tất cả nơi làm việc", en: "All Locations", cn: "所有工作地点" } };
    const allPos = { id: "all", label: { vi: "Tất cả vị trí", en: "All Positions", cn: "所有职位" } };

    // Dynamic departments
    const departments = [allDept, ...Array.from(departmentSet).map(dept => ({
      id: normalizeForFilter(dept),
      label: { vi: dept, en: dept, cn: dept }
    }))];

    // Dynamic locations  
    const locations = [allLoc, ...Array.from(locationSet).map(loc => ({
      id: normalizeForFilter(loc),
      label: { vi: loc, en: loc, cn: loc }
    }))];

    // Position categories with better labels
    const positionLabels: Record<string, { vi: string; en: string; cn: string }> = {
      staff: { vi: "Nhân viên", en: "Staff", cn: "员工" },
      manager: { vi: "Trưởng/Quản lý", en: "Manager/Lead", cn: "经理/主管" },
      deputy: { vi: "Phó/Trợ lý", en: "Deputy/Assistant", cn: "副职/助理" },
      director: { vi: "Giám đốc", en: "Director", cn: "总监" }
    };

    const positions = [allPos, ...Array.from(positionSet).map(pos => ({
      id: pos,
      label: positionLabels[pos] || { vi: pos, en: pos, cn: pos }
    }))];

    return { departments, locations, positions };
  };

  const { departments, locations, positions } = getDynamicFilterOptions();

  // Improved filter function with fuzzy matching and search
  const filteredJobs = jobListings.filter((job: Job) => {
    const title = getLocalizedText(job.title);
    const department = getLocalizedText(job.department);
    const location = getLocalizedText(job.location);
    
    // Search query filtering
    const matchesSearch = !searchQuery.trim() || (() => {
      const query = normalizeForFilter(searchQuery.trim());
      const titleNorm = normalizeForFilter(title);
      const deptNorm = normalizeForFilter(department);
      const locNorm = normalizeForFilter(location);
      
      return titleNorm.includes(query) || 
             deptNorm.includes(query) || 
             locNorm.includes(query) ||
             query.split(' ').some(word => 
               titleNorm.includes(word) || 
               deptNorm.includes(word) || 
               locNorm.includes(word)
             );
    })();
    
    // Position filtering with better logic
    const matchesPosition = selectedPosition === "all" || (() => {
      const titleLower = title.toLowerCase();
      switch (selectedPosition) {
        case "director":
          return titleLower.includes("giám đốc") || titleLower.includes("director");
        case "manager":
          return (titleLower.includes("trưởng") || titleLower.includes("manager")) && 
                 !titleLower.includes("giám đốc");
        case "deputy":
          return titleLower.includes("phó") || titleLower.includes("deputy");
        case "staff":
          return !titleLower.includes("trưởng") && 
                 !titleLower.includes("phó") && 
                 !titleLower.includes("giám đốc") &&
                 !titleLower.includes("manager") &&
                 !titleLower.includes("director") &&
                 !titleLower.includes("deputy");
        default:
          return true;
      }
    })();

    // Department filtering with normalization
    const matchesDepartment = selectedDepartment === "all" ||
      normalizeForFilter(department) === selectedDepartment ||
      normalizeForFilter(department).includes(selectedDepartment) ||
      selectedDepartment.includes(normalizeForFilter(department));
    
    // Location filtering with normalization
    const matchesLocation = selectedLocation === "all" ||
      normalizeForFilter(location) === selectedLocation ||
      normalizeForFilter(location).includes(selectedLocation) ||
      selectedLocation.includes(normalizeForFilter(location));

    return matchesSearch && matchesPosition && matchesDepartment && matchesLocation;
  });

  // Reset all filters
  const resetFilters = () => {
    setSelectedPosition("all");
    setSelectedDepartment("all");
    setSelectedLocation("all");
    setSearchQuery("");
  };

  // Loading skeleton component
  const JobCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-20 mb-3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16 ml-auto" />
      </CardFooter>
    </Card>
  );

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/img/banner_about.png" 
            alt="Careers banner"
            fill
            className="object-cover opacity-15" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-blue-600/40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {locale === "vi" ? "Cơ Hội Nghề Nghiệp" : 
               locale === "en" ? "Career Opportunities" :
               "职业机会"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              {locale === "vi" ? "Khám phá và phát triển sự nghiệp cùng Chi Ma HTT Logistics - nơi tài năng được tôn vinh và phát triển" : 
               locale === "en" ? "Discover and develop your career with Chi Ma HTT Logistics - where talent is honored and developed" :
               "与 Chi Ma HTT 物流一起探索和发展您的职业生涯 - 人才受到尊重和发展的地方"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-semibold">
                {locale === "vi" ? "Xem tất cả vị trí" : 
                 locale === "en" ? "View all positions" :
                 "查看所有职位"}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
                {locale === "vi" ? "Tìm hiểu về công ty" : 
                 locale === "en" ? "Learn about company" :
                 "了解公司"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating shapes for visual interest */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-lg"></div>
      </section>

      {/* Filter section */}
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-8 border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {locale === "vi" ? "Tìm kiếm và lọc vị trí công việc" : 
               locale === "en" ? "Search and filter job positions" : 
               "搜索和筛选职位"}
            </h2>
            
            {/* Search input */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="text"
                  placeholder={
                    locale === "vi" ? "Tìm kiếm theo tên vị trí, ngành nghề, địa điểm..." : 
                    locale === "en" ? "Search by position name, department, location..." : 
                    "按职位名称、部门、地点搜索..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Position filter dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6" />
                  </svg>
                  {locale === "vi" ? "Vị trí" : 
                   locale === "en" ? "Position" : 
                   "职位"}
                </label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder={
                      locale === "vi" ? "Chọn vị trí" : 
                      locale === "en" ? "Select position" : 
                      "选择职位"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(position => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.label[locale as keyof typeof position.label]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Department filter dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {locale === "vi" ? "Ngành nghề" : 
                   locale === "en" ? "Department" : 
                   "部门"}
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder={
                      locale === "vi" ? "Chọn ngành nghề" : 
                      locale === "en" ? "Select department" : 
                      "选择部门"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(department => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.label[locale as keyof typeof department.label]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location filter dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locale === "vi" ? "Nơi làm việc" : 
                   locale === "en" ? "Location" : 
                   "工作地点"}
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder={
                      locale === "vi" ? "Chọn nơi làm việc" : 
                      locale === "en" ? "Select location" : 
                      "选择工作地点"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.label[locale as keyof typeof location.label]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset filters button */}
              <div>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {locale === "vi" ? "Xóa bộ lọc" : 
                   locale === "en" ? "Reset filters" : 
                   "重置筛选"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job listings section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {locale === "vi" ? "Vị trí tuyển dụng" : 
               locale === "en" ? "Job Positions" : 
               "招聘职位"}
            </h2>
            {!loading && (
              <>
                <p className="text-gray-600 mb-2">
                  {locale === "vi" ? `Tìm thấy ${filteredJobs.length} vị trí phù hợp` : 
                   locale === "en" ? `Found ${filteredJobs.length} matching positions` : 
                   `找到 ${filteredJobs.length} 个匹配职位`}
                </p>
                
                {/* Active filters indicator */}
                {(searchQuery || selectedPosition !== "all" || selectedDepartment !== "all" || selectedLocation !== "all") && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {locale === "vi" ? `Tìm: "${searchQuery}"` : 
                         locale === "en" ? `Search: "${searchQuery}"` : 
                         `搜索: "${searchQuery}"`}
                        <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-blue-200 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    )}
                    {selectedPosition !== "all" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {locale === "vi" ? "Vị trí: " : locale === "en" ? "Position: " : "职位: "}
                        {positions.find(p => p.id === selectedPosition)?.label?.[locale as 'vi' | 'en' | 'cn']}
                        <button onClick={() => setSelectedPosition("all")} className="ml-1 hover:bg-green-200 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    )}
                    {selectedDepartment !== "all" && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {locale === "vi" ? "Ngành: " : locale === "en" ? "Dept: " : "部门: "}
                        {departments.find(d => d.id === selectedDepartment)?.label?.[locale as 'vi' | 'en' | 'cn']}
                        <button onClick={() => setSelectedDepartment("all")} className="ml-1 hover:bg-purple-200 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    )}
                    {selectedLocation !== "all" && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {locale === "vi" ? "Địa điểm: " : locale === "en" ? "Location: " : "地点: "}
                        {locations.find(l => l.id === selectedLocation)?.label?.[locale as 'vi' | 'en' | 'cn']}
                        <button onClick={() => setSelectedLocation("all")} className="ml-1 hover:bg-orange-200 rounded">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {!loading && filteredJobs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {locale === "vi" ? "Sắp xếp theo ngày đăng" : 
               locale === "en" ? "Sorted by posting date" : 
               "按发布日期排序"}
            </div>
          )}
        </div>

        {/* Error handling */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <Link href={`/careers/${job.id}`} key={job.id} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 hover:border-blue-300">
                  {job.primary_image && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={job.primary_image}
                        alt={getLocalizedText(job.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {job.isHot && (
                        <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          Hot
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                        {getLocalizedText(job.title)}
                      </CardTitle>
                      {!job.primary_image && job.isHot && (
                        <Badge variant="destructive" className="ml-2 flex-shrink-0">
                          {locale === "vi" ? "Hot" : 
                           locale === "en" ? "Hot" :
                           "热门"}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2 text-gray-600">
                      <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {getLocalizedText(job.location)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        {getLocalizedText(job.department)}
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">
                        {locale === "vi" ? `Hạn: ${job.dueDate}` : 
                         locale === "en" ? `Due: ${job.dueDate}` :
                         `截止: ${job.dueDate}`}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      {locale === "vi" ? "Chi tiết" : 
                       locale === "en" ? "Details" :
                       "详情"}
                      <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            )) : !loading && (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {locale === "vi" ? "Không tìm thấy vị trí phù hợp" : 
                     locale === "en" ? "No matching positions found" : 
                     "未找到匹配的职位"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {locale === "vi" ? "Thử điều chỉnh bộ lọc hoặc quay lại sau để xem thêm cơ hội mới" : 
                     locale === "en" ? "Try adjusting your filters or check back later for new opportunities" : 
                     "尝试调整筛选器或稍后回来查看新机会"}
                  </p>
                  <Button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700">
                    {locale === "vi" ? "Xóa tất cả bộ lọc" : 
                     locale === "en" ? "Clear all filters" : 
                     "清除所有筛选器"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Why work with us section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {locale === "vi" ? "Tại sao chọn Chi Ma HTT?" : 
             locale === "en" ? "Why work with Chi Ma HTT?" :
             "为什么选择 Chi Ma HTT?"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Item 1 */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {locale === "vi" ? "Môi trường chuyên nghiệp" : 
                 locale === "en" ? "Professional Environment" :
                 "专业环境"}
              </h3>
              <p className="text-gray-600">
                {locale === "vi" ? "Môi trường làm việc thân thiện, chuyên nghiệp với cơ hội thăng tiến nhanh" : 
                 locale === "en" ? "Friendly, professional working environment with fast career advancement opportunities" :
                 "友好、专业的工作环境，快速晋升机会"}
              </p>
            </div>
            
            {/* Item 2 */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {locale === "vi" ? "Thu nhập hấp dẫn" : 
                 locale === "en" ? "Competitive Salary" :
                 "有竞争力的薪资"}
              </h3>
              <p className="text-gray-600">
                {locale === "vi" ? "Mức lương thỏa thuận cạnh tranh theo năng lực và các khoản thưởng hấp dẫn" : 
                 locale === "en" ? "Competitive salary based on qualifications and attractive bonuses" :
                 "根据资质提供有竞争力的薪资和吸引人的奖金"}
              </p>
            </div>
            
            {/* Item 3 */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {locale === "vi" ? "Phúc lợi đầy đủ" : 
                 locale === "en" ? "Full Benefits" :
                 "完善的福利"}
              </h3>
              <p className="text-gray-600">
                {locale === "vi" ? "Bảo hiểm đầy đủ, ăn ca miễn phí, lương tháng 13 và các chế độ phúc lợi khác" : 
                 locale === "en" ? "Full insurance, free meals, 13th month bonus and other benefits" :
                 "全面保险、免费餐食、第13个月奖金和其他福利"}
              </p>
            </div>
            
            {/* Item 4 */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {locale === "vi" ? "Đào tạo và phát triển" : 
                 locale === "en" ? "Training & Development" :
                 "培训与发展"}
              </h3>
              <p className="text-gray-600">
                {locale === "vi" ? "Cơ hội tham gia vào các khóa đào tạo nghiệp vụ, phát triển kỹ năng chuyên môn" : 
                 locale === "en" ? "Opportunities to participate in professional training courses and skill development" :
                 "参加专业培训课程和技能发展的机会"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Application process */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {locale === "vi" ? "Quy trình ứng tuyển" : 
           locale === "en" ? "Application Process" :
           "申请流程"}
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[25px] inset-y-0 w-0.5 bg-blue-200"></div>
            
            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex items-start">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <div className="ml-6 pb-8">
                  <h3 className="text-xl font-bold">
                    {locale === "vi" ? "Nộp hồ sơ ứng tuyển" : 
                     locale === "en" ? "Submit Application" :
                     "提交申请"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {locale === "vi" ? "Gửi CV và đơn ứng tuyển qua email hoặc nộp trực tiếp tại văn phòng công ty" : 
                     locale === "en" ? "Send your CV and application via email or submit directly at our office" :
                     "通过电子邮件发送简历和申请，或直接在我们的办公室提交"}
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-start">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <div className="ml-6 pb-8">
                  <h3 className="text-xl font-bold">
                    {locale === "vi" ? "Sàng lọc hồ sơ" : 
                     locale === "en" ? "Resume Screening" :
                     "简历筛选"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {locale === "vi" ? "Phòng nhân sự sẽ sàng lọc hồ sơ và liên hệ với các ứng viên phù hợp" : 
                     locale === "en" ? "The HR department will screen applications and contact suitable candidates" :
                     "人力资源部门将筛选申请并联系合适的候选人"}
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex items-start">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <span className="font-bold">3</span>
                </div>
                <div className="ml-6 pb-8">
                  <h3 className="text-xl font-bold">
                    {locale === "vi" ? "Phỏng vấn" : 
                     locale === "en" ? "Interview" :
                     "面试"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {locale === "vi" ? "Tham gia phỏng vấn trực tiếp hoặc online với quản lý trực tiếp và phòng nhân sự" : 
                     locale === "en" ? "Participate in direct or online interviews with the direct manager and HR department" :
                     "与直接经理和人力资源部门进行直接或在线面试"}
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex items-start">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <span className="font-bold">4</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold">
                    {locale === "vi" ? "Thông báo kết quả & Nhận việc" : 
                     locale === "en" ? "Results & Onboarding" :
                     "结果通知和入职"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {locale === "vi" ? "Ứng viên được chọn sẽ nhận thông báo và bắt đầu quy trình nhận việc" : 
                     locale === "en" ? "Selected candidates will receive notification and start the onboarding process" :
                     "被选中的候选人将收到通知并开始入职流程"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {locale === "vi" ? "Bạn có câu hỏi về tuyển dụng?" : 
             locale === "en" ? "Have questions about our openings?" :
             "对我们的招聘有疑问？"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {locale === "vi" ? "Liên hệ với phòng nhân sự của chúng tôi để được hỗ trợ thông tin tuyển dụng chi tiết" : 
             locale === "en" ? "Contact our HR department for detailed recruitment information and support" :
             "联系我们的人力资源部门获取详细的招聘信息和支持"}
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {locale === "vi" ? "duydq@chimahtt.com" : "duydq@chimahtt.com"}
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {locale === "vi" ? "0987461811" : "0987461811"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 