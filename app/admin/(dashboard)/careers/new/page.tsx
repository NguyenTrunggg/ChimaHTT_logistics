"use client";

import JobForm from "@/components/admin/careers/job-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Đăng tin tuyển dụng mới</h1>
      </div>

      <JobForm />
    </div>
  );
} 