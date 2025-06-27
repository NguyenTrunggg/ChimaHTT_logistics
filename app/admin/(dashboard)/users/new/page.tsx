"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import UserForm from "@/components/admin/users/user-form";

export default function NewUserPage() {
  const router = useRouter();

  return (
    <PermissionGuard permission={ADMIN_PERMISSIONS.USERS_CREATE}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/admin/users")} 
                className="p-2 h-auto hover:bg-white/80 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                    Tạo Người dùng mới
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Thêm tài khoản người dùng vào hệ thống
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Quản lý người dùng</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <UserForm />
      </div>
    </PermissionGuard>
  );
} 