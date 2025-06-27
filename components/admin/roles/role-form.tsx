"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { roleService, permissionApiService } from "@/lib/services";
import { Role, Permission } from "@/lib/types/user";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import { 
  Save, 
  ArrowLeft, 
  ShieldCheck, 
  Key, 
  Database, 
  Newspaper, 
  Briefcase, 
  Users, 
  Settings, 
  Container,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const roleSchema = z.object({
  name: z.string().min(1, "Tên vai trò không được trống"),
  permissions: z.array(z.number()).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  role?: Role;
  isEdit?: boolean;
}

// Permission categories for better organization
const PERMISSION_CATEGORIES = {
  dashboard: {
    label: "Dashboard",
    icon: Database,
    color: "bg-blue-500",
    permissions: ["dashboard:read"]
  },
  services: {
    label: "Dịch vụ",
    icon: Settings,
    color: "bg-green-500",
    permissions: ["service:read", "service:create", "service:update", "service:delete"]
  },
  news: {
    label: "Tin tức",
    icon: Newspaper,
    color: "bg-purple-500",
    permissions: ["news:read", "news:create", "news:update", "news:delete", "news:publish"]
  },
  careers: {
    label: "Tuyển dụng",
    icon: Briefcase,
    color: "bg-orange-500",
    permissions: ["job:read", "job:create", "job:update", "job:delete", "job:manage_applications"]
  },
  users: {
    label: "Người dùng",
    icon: Users,
    color: "bg-indigo-500",
    permissions: ["user:read", "user:create", "user:update", "user:delete", "users:manage_permissions"]
  },
  roles: {
    label: "Vai trò",
    icon: ShieldCheck,
    color: "bg-yellow-500",
    permissions: ["role:read", "role:create", "role:update", "role:delete", "role:manage_permissions"]
  },
  containers: {
    label: "Container",
    icon: Container,
    color: "bg-teal-500",
    permissions: ["container:read", "container:create", "container:update", "container:delete"]
  },
  settings: {
    label: "Cấu hình",
    icon: Settings,
    color: "bg-gray-500",
    permissions: ["system-config:read", "system-config:create", "system-config:update", "system-config:delete"]
  },
};

export default function RoleForm({ role, isEdit = false }: RoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      permissions: role?.permissions?.map(p => p.id) || [],
    },
  });

  useEffect(() => {
    // Load all permissions
    loadPermissions();
    
    if (role?.permissions) {
      const permissionIds = role.permissions.map(p => p.id);
      setSelectedPermissions(permissionIds);
      setValue("permissions", permissionIds);
    }
  }, [role, setValue]);

  const loadPermissions = async () => {
    try {
      // Try to fetch real permissions from API first
      try {
        const permissions = await permissionApiService.list();
        if (permissions && permissions.length > 0) {
          setAllPermissions(permissions);
          return;
        }
      } catch (apiError) {
        console.warn("Could not fetch permissions from API, using mock data:", apiError);
      }

      // Fallback: Create mock permissions based on our constants, but only for existing IDs
      const mockPermissions: Permission[] = Object.values(ADMIN_PERMISSIONS)
        .map((permission, index) => ({
          id: index + 1,
          action: permission.split(':')[1],
          subject: permission.split(':')[0],
        }))
        .filter(p => p.id <= 30); // Only include IDs that exist in DB (1-30)
        
      setAllPermissions(mockPermissions);
    } catch (err) {
      console.error("Failed to load permissions:", err);
    }
  };

  const onSubmit = async (data: RoleFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...data,
        permissions: selectedPermissions,
      };

      if (isEdit && role) {
        await roleService.update(role.id, payload);
        setSuccess("Vai trò đã được cập nhật thành công!");
      } else {
        await roleService.create(payload);
        setSuccess("Vai trò đã được tạo thành công!");
      }

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/roles");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi lưu vai trò");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    const newSelected = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newSelected);
    setValue("permissions", newSelected);
  };

  const toggleCategoryPermissions = (category: string) => {
    const categoryPermissions = PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES].permissions;
    const categoryPermissionIds = allPermissions
      .filter(p => categoryPermissions.includes(`${p.subject}:${p.action}`))
      .map(p => p.id);

    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Remove all category permissions
      const newSelected = selectedPermissions.filter(id => !categoryPermissionIds.includes(id));
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    } else {
      // Add all category permissions
      const newSelected = [...new Set([...selectedPermissions, ...categoryPermissionIds])];
      setSelectedPermissions(newSelected);
      setValue("permissions", newSelected);
    }
  };

  const renderPermissionCategory = (categoryKey: string, category: any) => {
    const categoryPermissions = allPermissions.filter(p => 
      category.permissions.includes(`${p.subject}:${p.action}`)
    );
    
    const selectedCount = categoryPermissions.filter(p => selectedPermissions.includes(p.id)).length;
    const totalCount = categoryPermissions.length;
    const allSelected = selectedCount === totalCount;
    const someSelected = selectedCount > 0 && selectedCount < totalCount;

    const Icon = category.icon;

    return (
      <Card key={categoryKey} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl">
        <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
              <div className={`p-2 ${category.color} rounded-xl shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span>{category.label}</span>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white">
                {selectedCount}/{totalCount}
              </Badge>
              <Checkbox
                checked={allSelected}
                ref={someSelected ? (ref) => ref && (ref.indeterminate = true) : undefined}
                onCheckedChange={() => toggleCategoryPermissions(categoryKey)}
                className="data-[state=checked]:bg-[#00b764] data-[state=checked]:border-[#00b764]"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            {categoryPermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                  className="data-[state=checked]:bg-[#00b764] data-[state=checked]:border-[#00b764]"
                />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                    {permission.action}:{permission.subject}
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {getPermissionDescription(permission.action, permission.subject)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getPermissionDescription = (action: string, subject: string) => {
    const descriptions: Record<string, string> = {
      "read": "Xem danh sách và chi tiết",
      "create": "Tạo mới",
      "update": "Chỉnh sửa",
      "delete": "Xóa",
      "publish": "Xuất bản",
      "manage_permissions": "Quản lý quyền hạn",
      "manage_applications": "Quản lý đơn ứng tuyển",
    };
    
    return descriptions[action] || `Thực hiện ${action} trên ${subject}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-green-300 text-green-700 hover:bg-green-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa Vai trò" : "Tạo Vai trò mới"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? "Cập nhật thông tin và quyền hạn của vai trò" : "Tạo vai trò mới và phân quyền"}
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-[#00b764] rounded-xl shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              Thông tin Vai trò
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Tên vai trò <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nhập tên vai trò..."
                className="mt-2 border-green-200 focus:border-[#00b764] focus:ring-[#00b764]"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Đã chọn {selectedPermissions.length} quyền hạn
                </span>
              </div>
              <p className="text-xs text-blue-600">
                Chọn các quyền hạn phù hợp cho vai trò này trong tab "Phân quyền" bên dưới
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Card className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-purple-500 rounded-xl shadow-sm">
                <Key className="h-6 w-6 text-white" />
              </div>
              Phân quyền
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) =>
                  renderPermissionCategory(key, category)
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#00b764] hover:bg-green-700 text-white px-8"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 