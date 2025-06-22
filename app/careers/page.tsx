"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CareersPage() {
  const { t, locale } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Mock job listings data - in a real app, this would come from an API or CMS
  const jobListings = [
    {
      id: "accountant",
      title: {
        vi: "Nhân viên Kế toán Doanh Thu",
        en: "Revenue Accountant",
        cn: "收入会计"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Kế toán",
        en: "Accounting",
        cn: "会计"
      },
      dueDate: "31/03/2024",
      isHot: true
    },
    {
      id: "import-export",
      title: {
        vi: "Nhân viên Xuất nhập khẩu",
        en: "Import-Export Specialist",
        cn: "进出口专员"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Xuất nhập khẩu",
        en: "Import-Export",
        cn: "进出口"
      },
      dueDate: "29/02/2024",
      isHot: false
    },
    {
      id: "transport-coordinator",
      title: {
        vi: "Nhân viên Điều phối Vận tải",
        en: "Transport Coordinator",
        cn: "运输协调员"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Vận tải",
        en: "Transport",
        cn: "运输"
      },
      dueDate: "29/02/2024",
      isHot: true
    },
    {
      id: "hr-admin",
      title: {
        vi: "Nhân viên Hành chính Nhân sự",
        en: "HR Administration Staff",
        cn: "人力资源行政人员"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Hành chính Nhân sự",
        en: "HR Administration",
        cn: "人力资源行政"
      },
      dueDate: "29/02/2024",
      isHot: false
    },
    {
      id: "deputy-business-director",
      title: {
        vi: "Phó Giám đốc Kinh doanh",
        en: "Deputy Business Director",
        cn: "业务副总监"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Kinh doanh",
        en: "Business",
        cn: "业务"
      },
      dueDate: "29/02/2024",
      isHot: true
    },
    {
      id: "import-export-manager",
      title: {
        vi: "Trưởng phòng Xuất nhập khẩu",
        en: "Import-Export Manager",
        cn: "进出口经理"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Xuất nhập khẩu",
        en: "Import-Export",
        cn: "进出口"
      },
      dueDate: "29/02/2024",
      isHot: true
    },
    {
      id: "business-staff",
      title: {
        vi: "Nhân viên Kinh doanh",
        en: "Business Staff",
        cn: "业务人员"
      },
      location: {
        vi: "Lạng Sơn",
        en: "Lang Son",
        cn: "谅山"
      },
      department: {
        vi: "Kinh doanh",
        en: "Business",
        cn: "业务"
      },
      dueDate: "29/02/2024",
      isHot: false
    }
  ];

  // Department categories
  const departments = [
    { id: "all", label: { vi: "Tất cả ngành nghề", en: "All Departments", cn: "所有部门" } },
    { id: "accounting", label: { vi: "Kế toán", en: "Accounting", cn: "会计" } },
    { id: "import-export", label: { vi: "Xuất nhập khẩu", en: "Import-Export", cn: "进出口" } },
    { id: "transport", label: { vi: "Vận tải", en: "Transport", cn: "运输" } },
    { id: "hr-admin", label: { vi: "Hành chính Nhân sự", en: "HR Administration", cn: "人力资源行政" } },
    { id: "business", label: { vi: "Kinh doanh", en: "Business", cn: "业务" } }
  ];

  // Location categories
  const locations = [
    { id: "all", label: { vi: "Tất cả nơi làm việc", en: "All Locations", cn: "所有工作地点" } },
    { id: "lang-son", label: { vi: "Lạng Sơn", en: "Lang Son", cn: "谅山" } },
    { id: "hanoi", label: { vi: "Hà Nội", en: "Hanoi", cn: "河内" } },
    { id: "hai-phong", label: { vi: "Hải Phòng", en: "Hai Phong", cn: "海防" } }
  ];

  // Job positions categories
  const positions = [
    { id: "all", label: { vi: "Tất cả vị trí", en: "All Positions", cn: "所有职位" } },
    { id: "staff", label: { vi: "Nhân Viên", en: "Staff", cn: "员工" } },
    { id: "manager", label: { vi: "Trưởng phòng", en: "Manager", cn: "经理" } },
    { id: "deputy-director", label: { vi: "Phó Giám đốc", en: "Deputy Director", cn: "副总监" } }
  ];

  // Filter job listings based on selected filters
  const filteredJobs = jobListings.filter(job => {
    const matchesPosition = selectedPosition === "all" || 
      (selectedPosition === "staff" && !job.title[locale].includes("Trưởng phòng") && !job.title[locale].includes("Giám đốc")) ||
      (selectedPosition === "manager" && job.title[locale].includes("Trưởng phòng")) ||
      (selectedPosition === "deputy-director" && job.title[locale].includes("Giám đốc"));
    
    const matchesDepartment = selectedDepartment === "all" || 
      (selectedDepartment === "accounting" && job.department[locale].includes("Kế toán")) ||
      (selectedDepartment === "import-export" && job.department[locale].includes("Xuất nhập khẩu")) ||
      (selectedDepartment === "transport" && job.department[locale].includes("Vận tải")) ||
      (selectedDepartment === "hr-admin" && job.department[locale].includes("Nhân sự")) ||
      (selectedDepartment === "business" && job.department[locale].includes("Kinh doanh"));
    
    const matchesLocation = selectedLocation === "all" || 
      (selectedLocation === "lang-son" && job.location[locale].includes("Lạng Sơn")) ||
      (selectedLocation === "hanoi" && job.location[locale].includes("Hà Nội")) ||
      (selectedLocation === "hai-phong" && job.location[locale].includes("Hải Phòng"));
    
    return matchesPosition && matchesDepartment && matchesLocation;
  });

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/img/banner_about.png" 
            alt="Careers banner"
            fill
            className="object-cover opacity-20" 
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('careers')}</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            {locale === "vi" ? "Khám phá cơ hội nghề nghiệp tại Chi Ma HTT Logistics" : 
             locale === "en" ? "Explore Career Opportunities at Chi Ma HTT Logistics" :
             "在 Chi Ma HTT 物流探索职业机会"}
          </p>
        </div>
      </div>

      {/* Filter section - Replace tabs with dropdowns */}
      <div className="bg-gray-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Position filter dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === "vi" ? "Vị trí" : 
                 locale === "en" ? "Position" : 
                 "职位"}
              </label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    locale === "vi" ? "Chọn vị trí" : 
                    locale === "en" ? "Select position" : 
                    "选择职位"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(position => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.label[locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department filter dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === "vi" ? "Ngành nghề" : 
                 locale === "en" ? "Department" : 
                 "部门"}
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    locale === "vi" ? "Chọn ngành nghề" : 
                    locale === "en" ? "Select department" : 
                    "选择部门"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(department => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.label[locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Location filter dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === "vi" ? "Nơi làm việc" : 
                 locale === "en" ? "Location" : 
                 "工作地点"}
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    locale === "vi" ? "Chọn nơi làm việc" : 
                    locale === "en" ? "Select location" : 
                    "选择工作地点"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.label[locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset filters button */}
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedPosition("all");
                  setSelectedDepartment("all");
                  setSelectedLocation("all");
                }}
              >
                {locale === "vi" ? "Xóa bộ lọc" : 
                 locale === "en" ? "Reset filters" : 
                 "重置筛选"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Job listings - Now displays filtered results */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {locale === "vi" ? `Có ${filteredJobs.length} vị trí tuyển dụng` : 
             locale === "en" ? `${filteredJobs.length} jobs found` : 
             `找到 ${filteredJobs.length} 个职位`}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <Link href={`/careers/${job.id}`} key={job.id}>
              <Card className="h-full transition-all hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{job.title[locale]}</CardTitle>
                    {job.isHot && (
                      <Badge variant="destructive">
                        {locale === "vi" ? "Hot" : 
                         locale === "en" ? "Hot" :
                         "热门"}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location[locale]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">
                      {job.department[locale]}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {locale === "vi" ? `Hạn nộp: ${job.dueDate}` : 
                     locale === "en" ? `Due date: ${job.dueDate}` :
                     `截止日期: ${job.dueDate}`}
                  </div>
                  <Button variant="ghost" size="sm">
                    {locale === "vi" ? "Xem thêm" : 
                     locale === "en" ? "View more" :
                     "查看更多"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">
                {locale === "vi" ? "Không tìm thấy vị trí phù hợp với bộ lọc của bạn" : 
                 locale === "en" ? "No positions match your selected filters" : 
                 "没有符合您所选筛选条件的职位"}
              </p>
            </div>
          )}
        </div>
      </div>

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
              {locale === "vi" ? "hr@chimahtt.com" : "hr@chimahtt.com"}
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {locale === "vi" ? "+84 09 33 767 040" : "+84 09 33 767 040"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 