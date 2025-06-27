"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { userService, UserProfile } from "@/lib/services";
import { Users, Edit, Trash2, Mail, UserCheck, Shield, Clock } from "lucide-react";
import PageLayout from "@/components/admin/common/page-layout";

const ITEMS_PER_PAGE = 9;

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const data = await userService.list();
        // Ensure array structure
        const arr = Array.isArray((data as any)?.data) ? (data as any).data : (Array.isArray(data) ? data : []);
        setUsers(arr);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xoá người dùng thất bại");
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Quản trị viên</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">{roleName}</Badge>;

    }
  };

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((user.role as any)?.name || user.role)?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedData = filteredUsers.slice(
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

  // Statistics
  const stats = [
    {
      label: "Tổng người dùng",
      value: users.length,
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-[#00b764] to-green-600"
    },
    {
      label: "Quản trị viên",
      value: users.filter(u => ((u.role as any)?.name || u.role)?.toLowerCase() === 'admin').length,
      icon: <Shield className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      label: "Người dùng",
      value: users.filter(u => ((u.role as any)?.name || u.role)?.toLowerCase() === 'user').length,
      icon: <UserCheck className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      label: "Hoạt động",
      value: users.filter(u => u.email).length, // Assuming users with email are active
      icon: <Clock className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    }
  ];

  // Grid view render function
  const renderGridItem = (user: UserProfile) => (
    <Card key={user.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.username || "(Không có tên)"}
            </h3>
            {getRoleBadge((user.role as any)?.name ?? (user.role as any) ?? "")}
          </div>
        </div>

        {user.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <Mail className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200" asChild>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200"
            onClick={() => handleDelete(user.id as number)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // List view render function
  const renderListItem = (user: UserProfile) => (
    <Card key={user.id} className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-[#00b764] to-green-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.username || "(Không có tên)"}
                </h3>
                {getRoleBadge((user.role as any)?.name ?? (user.role as any) ?? "")}
              </div>
              
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <Button variant="outline" size="sm" asChild className="border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200">
              <Link href={`/admin/users/${user.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-400 transition-all duration-200"
              onClick={() => handleDelete(user.id as number)}
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
      title="Quản lý Người dùng"
      description="Quản lý tài khoản và phân quyền người dùng"
      addButtonText="Thêm người dùng"
      addButtonHref="/admin/users/new"
      icon={<Users className="h-12 w-12 text-green-600" />}
      
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Tìm kiếm theo tên, email, vai trò..."
      
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      
      data={users}
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
