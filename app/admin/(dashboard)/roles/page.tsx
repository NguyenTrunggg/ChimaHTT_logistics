"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { roleService } from "@/lib/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ShieldCheck, Users, Key, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/admin/common/page-layout";
import { Role } from "@/lib/types/user";

const ITEMS_PER_PAGE = 9;

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await roleService.list() as any;
        console.log("Roles API Response:", response); // Debug log
        // Handle both direct array and paginated response structure
        const rolesData = Array.isArray(response) ? response : (response.data || []);
        setRoles(rolesData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách vai trò");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa vai trò này?")) return;
    try {
      await roleService.remove(id);
      setRoles(roles.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa vai trò thất bại");
    }
  };

  // Filter and search roles - Add safety check
  const filteredRoles = useMemo(() => {
    if (!Array.isArray(roles)) {
      console.warn("Roles is not an array:", roles);
      return [];
    }
    return roles.filter((role) => {
      const matchesSearch = role.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [roles, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);
  const paginatedData = filteredRoles.slice(
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

  // Statistics with safety checks
  const stats = [
    {
      label: "Tổng vai trò",
      value: Array.isArray(roles) ? roles.length : 0,
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Admin roles",
      value: Array.isArray(roles) ? roles.filter(r => r.name?.toLowerCase().includes('admin')).length : 0,
      icon: <Crown className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600"
    },
    {
      label: "User roles",
      value: Array.isArray(roles) ? roles.filter(r => r.name?.toLowerCase().includes('user')).length : 0,
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      label: "Có permissions",
      value: Array.isArray(roles) ? roles.filter(r => r.permissions && r.permissions.length > 0).length : 0,
      icon: <Key className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
  ];

  // Grid view render function
  const renderGridItem = (role: Role) => (
    <Card key={role.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#00b764]" />
            </div>
            <span className="truncate">{role.name}</span>
          </CardTitle>
          <Badge 
            variant={role.name?.toLowerCase().includes('admin') ? "default" : "secondary"} 
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              role.name?.toLowerCase().includes('admin')
                ? "bg-yellow-100 text-yellow-700 border-yellow-200" 
                : "bg-blue-100 text-blue-700 border-blue-200"
            }`}
          >
            {role.name?.toLowerCase().includes('admin') ? "Admin" : "User"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Role Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">Số người dùng:</span>
            <span className="font-medium text-gray-800">
              {role.users?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Key className="h-4 w-4 text-indigo-600" />
            <span className="text-gray-600">Quyền hạn:</span>
            <span className="font-medium text-gray-800">
              {role.permissions?.length || 0} permissions
            </span>
          </div>
        </div>

        {/* Permissions preview */}
        {role.permissions && role.permissions.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <div className="text-xs font-medium text-blue-700 mb-2">Quyền hạn:</div>
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((permission, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                  {permission.action}:{permission.subject}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="text-xs text-blue-600">+{role.permissions.length - 3} khác</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
      {
        role.name?.toLowerCase() === 'admin' ? (
        <div className="flex gap-3 pt-4">
        <span className="text-xs text-gray-600">Không thể sửa</span>
        </div>
        ) : (
        <div className="flex gap-3 pt-4">
          <Button size="sm" variant="outline" disabled={role.name?.toLowerCase() === 'admin'} className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl transition-all duration-200" asChild>
            <Link href={`/admin/roles/${role.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" /> Sửa
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200"
            onClick={() => handleDelete(role.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Xóa
          </Button>
        </div>
        )
      }
      </CardContent>
    </Card>
  );

  // List view render function  
  const renderListItem = (role: Role) => (
    <Card key={role.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {role.name}
                </h3>
                <Badge 
                  variant={role.name?.toLowerCase().includes('admin') ? "default" : "secondary"} 
                  className={`w-fit ${
                    role.name?.toLowerCase().includes('admin')
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200" 
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}
                >
                  {role.name?.toLowerCase().includes('admin') ? "👑 Admin" : "👤 User"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-600">Người dùng:</span>
                  <span className="font-medium text-gray-800">{role.users?.length || 0}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-600">Quyền hạn:</span>
                  <span className="font-medium text-gray-800">{role.permissions?.length || 0}</span>
                </div>
              </div>

              {/* Permissions display for list view */}
              {role.permissions && role.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {role.permissions.slice(0, 5).map((permission, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      {permission.action}:{permission.subject}
                    </span>
                  ))}
                  {role.permissions.length > 5 && (
                    <span className="text-xs text-blue-600">+{role.permissions.length - 5}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
              <Link href={`/admin/roles/${role.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200" 
              onClick={() => handleDelete(role.id)}
              disabled={role.name?.toLowerCase() === 'admin'} // Prevent deleting admin role
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout
      title="Quản lý Vai trò"
      description="Quản lý vai trò và phân quyền người dùng"
      addButtonText="Thêm Vai trò"
      addButtonHref="/admin/roles/new"
      icon={<ShieldCheck className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm kiếm theo tên vai trò..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={roles}
      filteredData={paginatedData}
      loading={loading}
      error={error}
      
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      
      stats={stats}
      renderGridItem={renderGridItem}
      renderListItem={renderListItem}
    />
  );
} 