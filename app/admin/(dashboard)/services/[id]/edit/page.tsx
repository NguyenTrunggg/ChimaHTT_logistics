"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { servicesService, LogisticService } from "@/lib/services";
import ServiceForm from "@/components/admin/services/service-form";
import { ArrowLeft, Loader2, Edit, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [service, setService] = useState<LogisticService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const svcId = parseInt(id);
        if (isNaN(svcId)) {
          throw new Error("ID không hợp lệ");
        }
        const data = await servicesService.detail(svcId);
        setService(data);
      } catch (error) {
        console.error(error);
        setError("Không thể tải thông tin dịch vụ");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
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
              <p className="text-gray-600 font-medium">Đang tải thông tin dịch vụ...</p>
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
              onClick={() => router.push("/admin/services")} 
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
                onClick={() => router.push("/admin/services")}
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

  if (!service) return null;

  const translation = service.ServiceTranslation.find(t => t.language === "vi") || service.ServiceTranslation[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin/services")} 
            className="p-2 h-auto hover:bg-green-100 text-green-700 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
              Chỉnh sửa dịch vụ
            </h1>
            <p className="text-gray-600 mt-1">
              Cập nhật thông tin: <span className="font-medium text-green-700">{translation?.title || "Chưa có tiêu đề"}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-lg border border-green-200">
            <Wrench className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700">ID: {service.id}</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            <Edit className="h-5 w-5 text-green-600" />
            Thông tin dịch vụ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ServiceForm initialData={service} />
        </CardContent>
      </Card>
    </div>
  );
} 