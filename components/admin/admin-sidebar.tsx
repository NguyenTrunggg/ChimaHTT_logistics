"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { PermissionGuard, usePermissions } from "@/components/admin/permission-guard"
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Box,
  ShieldCheck
} from "lucide-react"

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  permission: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan hệ thống",
    permission: ADMIN_PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: "Quản lý Dịch vụ",
    href: "/admin/services",
    icon: Wrench,
    description: "Quản lý các dịch vụ logistics",
    permission: ADMIN_PERMISSIONS.SERVICES_VIEW,
  },
  {
    title: "Quản lý Tuyển dụng",
    href: "/admin/careers",
    icon: Briefcase,
    description: "Quản lý tin tuyển dụng",
    permission: ADMIN_PERMISSIONS.CAREERS_VIEW,
  },
  {
    title: "Quản lý Tin tức",
    href: "/admin/news",
    icon: Newspaper,
    description: "Quản lý bài viết tin tức",
    permission: ADMIN_PERMISSIONS.NEWS_VIEW,
  },
  {
    title: "Quản lý Người dùng",
    href: "/admin/users",
    icon: Users,
    description: "Quản lý tài khoản và phân quyền",
    permission: ADMIN_PERMISSIONS.USERS_VIEW,
  },
  {
    title: "Quản lý Vai trò",
    href: "/admin/roles",
    icon: ShieldCheck,
    description: "Quản lý vai trò và phân quyền",
    permission: ADMIN_PERMISSIONS.ROLES_VIEW,
  },
  {
    title: "Cấu hình Hệ thống",
    href: "/admin/settings",
    icon: Settings,
    description: "Cài đặt hệ thống",
    permission: ADMIN_PERMISSIONS.SETTINGS_VIEW,
  },
  {
    title: "Quản lý Container",
    href: "/admin/containers",
    icon: Box,
    description: "Quản lý các container logistics",
    permission: ADMIN_PERMISSIONS.CONTAINERS_VIEW,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <div
      className={`
        relative flex flex-col h-full bg-gradient-to-b from-white via-green-50 to-white 
        border-r border-green-200 shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'} ${className}
      `}
    >
      {/* Modern backdrop with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-green-50/95 to-white/95 backdrop-blur-sm" />
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Logo */}
        <div className="flex items-center justify-between p-4 border-b border-green-200">
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "justify-center w-full" : "space-x-3"}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00b764] to-[#00a055] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">CH</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500 font-medium">ChimaHTT Logistics</p>
              </div>
          )}
        </div>
          
          {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-green-100 text-gray-600 hover:text-green-700 transition-all duration-200 rounded-lg"
        >
          {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
          ) : (
              <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

        {/* User Profile Section */}
        {user && (
          <div className={`p-4 border-b border-green-200 transition-all duration-300 ${isCollapsed ? "px-2" : ""}`}>
            <div className={`flex items-center transition-all duration-300 ${isCollapsed ? "justify-center" : "space-x-3"}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 transition-opacity duration-300">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full mt-2 border border-green-300">
                {user.role?.name}
              </span>
            </div>
              )}
          </div>
        </div>
      )}

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <PermissionGuard 
                key={item.href}
                permission={item.permission as any}
              >
                  <div 
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                <Link href={item.href}>
                  <Button
                       variant="ghost"
                       className={`
                         w-full h-12 transition-all duration-200 group relative overflow-hidden
                         ${isCollapsed ? "px-0 justify-center" : "justify-start px-4"}
                         ${isActive 
                           ? "bg-gradient-to-r from-[#00b764]/20 to-green-50 text-green-800 shadow-lg border border-[#00b764]/50" 
                           : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                         }
                       `}
                     >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00b764] to-emerald-400 rounded-r-full" />
                        )}
                        
                        {/* Icon */}
                        <div className={`relative ${isCollapsed ? "" : "mr-3"}`}>
                    <item.icon
                            className={`h-5 w-5 transition-all duration-200 ${
                              isActive ? "text-[#00b764]" : "group-hover:scale-110"
                            }`}
                    />
                        </div>
                        
                        {/* Label */}
                        {!isCollapsed && (
                          <span className="font-medium text-sm transition-all duration-200">
                            {item.title}
                          </span>
                    )}

                                                 {/* Hover effect overlay */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>

                     {/* Tooltip for collapsed state */}
                     {isCollapsed && (
                       <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-green-200">
                         {item.title}
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                       </div>
                     )}
                  </div>
              </PermissionGuard>
            );
          })}
        </nav>
      </ScrollArea>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-green-200">
        <Button
          variant="ghost"
          onClick={logout}
            className={`
              w-full h-12 transition-all duration-200 group relative overflow-hidden
              ${isCollapsed ? "px-0 justify-center" : "justify-start px-4"}
              text-red-500 hover:text-white hover:bg-red-500 border border-transparent hover:border-red-500
            `}
        >
            <LogOut className={`h-5 w-5 transition-all duration-200 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span className="font-medium text-sm">Đăng xuất</span>}
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>

          {/* Tooltip for collapsed logout */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 bottom-4 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-green-200 group">
              Đăng xuất
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
