"use client";

import RoleForm from "@/components/admin/roles/role-form";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";

export default function NewRolePage() {
  return (
    <PermissionGuard 
      permission={ADMIN_PERMISSIONS.ROLES_CREATE}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
            <p className="text-gray-600">Bạn không có quyền tạo vai trò mới.</p>
          </div>
        </div>
      }
    >
      <RoleForm isEdit={false} />
    </PermissionGuard>
  );
}
