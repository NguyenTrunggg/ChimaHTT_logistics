"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { jobService, JobArticle } from "@/lib/services";
import JobForm from "@/components/admin/careers/job-form";
import { ArrowLeft, Loader2, Edit, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<JobArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Convert string ID to number
        const jobId = parseInt(id);
        if (isNaN(jobId)) {
          throw new Error("ID không hợp lệ");
        }
        const data = await jobService.detail(jobId);
        setJob(data);
      } catch (error) {
        console.error(error);
        setError("Không thể tải thông tin tuyển dụng");
        // Don't redirect immediately, show error message
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id, router]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-6 bg-green-100 rounded-md animate-pulse"></div>
            <div className="w-48 h-8 bg-green-100 rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Loading Card */}
        <Card className="border border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardContent className="flex justify-center py-20">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-fit mx-auto mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
              <p className="text-gray-600 font-medium">Đang tải thông tin tuyển dụng...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/admin/careers")} 
              className="p-2 h-auto hover:bg-green-100 text-green-700 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              Lỗi tải dữ liệu
            </h1>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border border-red-300 shadow-lg bg-gradient-to-br from-white to-red-50">
          <CardContent className="text-center py-20">
            <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full w-fit mx-auto mb-4">
              <Edit className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Không thể tải thông tin</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-[#00b764] to-green-600 hover:from-[#00a055] hover:to-green-700 shadow-lg"
              >
                Thử lại
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin/careers")}
                className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400"
              >
                Quay lại danh sách
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) return null;

  const translation = job.translations.find(t => t.language === "vi") || job.translations[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin/careers")} 
            className="p-2 h-auto hover:bg-green-100 text-green-700 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              Chỉnh sửa tuyển dụng
            </h1>
            <p className="text-gray-600 mt-1">
              Cập nhật thông tin: <span className="font-medium text-green-700">{translation?.job_title || "Chưa có tiêu đề"}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-lg border border-green-200">
            <Briefcase className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700">ID: {job.id}</span>
          </div>
          <div className={`px-3 py-2 rounded-lg border font-medium ${
            job.status === "published" 
              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300" 
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-gray-300"
          }`}>
            {job.status === "published" ? "Đã công bố" : "Bản nháp"}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            <Edit className="h-5 w-5 text-green-600" />
            Thông tin tuyển dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <JobForm initialData={job} />
        </CardContent>
      </Card>
    </div>
  );
} 