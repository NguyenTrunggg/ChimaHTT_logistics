"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import {
  Users,
  Briefcase,
  Newspaper,
  Wrench,
  TrendingUp,
  Eye,
  Calendar,
  Bell,
  Lock,
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = [
    {
      title: "Tổng Dịch vụ",
      value: "6",
      change: "+2",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tin Tuyển dụng",
      value: "12",
      change: "+3",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Bài viết Tin tức",
      value: "24",
      change: "+5",
      icon: Newspaper,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Người dùng",
      value: "156",
      change: "+12",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentActivities = [
    {
      action: "Đã thêm tin tuyển dụng mới",
      detail: "Tuyển Nhân viên Logistics",
      time: "2 giờ trước",
      icon: Briefcase,
    },
    {
      action: "Đã cập nhật dịch vụ",
      detail: "Dịch vụ Kho bãi Bonded",
      time: "4 giờ trước",
      icon: Wrench,
    },
    {
      action: "Đã xuất bản bài viết",
      detail: "Xu hướng Logistics 2025",
      time: "1 ngày trước",
      icon: Newspaper,
    },
    {
      action: "Người dùng mới đăng ký",
      detail: "Nguyễn Văn A",
      time: "2 ngày trước",
      icon: Users,
    },
  ];

  return (
    <PermissionGuard 
      permission={ADMIN_PERMISSIONS.DASHBOARD_VIEW}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="border-red-200 bg-red-50 max-w-md w-full">
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Không có quyền truy cập</h2>
              <p className="text-red-600">Bạn không có quyền xem Dashboard. Vui lòng liên hệ quản trị viên để được cấp quyền.</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Tổng quan hoạt động hệ thống ChimaHTT Logistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {stat.change} tháng này
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="p-2 bg-gray-100 rounded-full">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">{activity.detail}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Thống kê truy cập
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Lượt xem hôm nay</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">1,234</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Người dùng online</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">89</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Tăng trưởng tuần</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}
