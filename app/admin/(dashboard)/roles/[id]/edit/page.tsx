"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleForm from "@/components/admin/roles/role-form";
import { roleService } from "@/lib/services";
import { Role } from "@/lib/types/user";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const id = params.id as string;
        if (!id || isNaN(Number(id))) {
          setError("ID vai trò không hợp lệ");
          return;
        }

        const response = await roleService.detail(Number(id));
        setRole(response);
      } catch (err: any) {
        console.error("Failed to fetch role:", err);
        setError("Không thể tải thông tin vai trò");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00b764] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin vai trò...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-red-200 bg-red-50 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Lỗi</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Quay lại
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy vai trò</h2>
          <p className="text-gray-600 mb-4">Vai trò với ID này không tồn tại.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#00b764] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard 
      permission={ADMIN_PERMISSIONS.ROLES_EDIT}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
            <p className="text-gray-600">Bạn không có quyền chỉnh sửa vai trò này.</p>
          </div>
        </div>
      }
    >
      <RoleForm role={role} isEdit={true} />
    </PermissionGuard>
  );
}
