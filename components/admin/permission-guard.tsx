"use client"

import { ReactNode } from "react";
import { useAdminAuth } from "@/contexts/admin-auth-context";
import { AdminPermission } from "@/lib/services/permission.service";

interface PermissionGuardProps {
  permission: AdminPermission;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // For multiple permissions
  permissions?: AdminPermission[]; // For multiple permissions
}

export function PermissionGuard({ 
  permission,
  permissions,
  children, 
  fallback = null,
  requireAll = false
}: PermissionGuardProps) {
  const { hasPermission } = useAdminAuth();

  // Check single permission
  if (permission && !permissions) {
    if (!hasPermission(permission)) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? permissions.every(p => hasPermission(p))
      : permissions.some(p => hasPermission(p));

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermissions() {
  const { hasPermission, canAccessAdmin } = useAdminAuth();

  return {
    hasPermission,
    canAccessAdmin,
    // Helper functions for common permission checks
    canViewDashboard: () => hasPermission("dashboard:view"),
    canManageServices: () => hasPermission("services:view"),
    canCreateServices: () => hasPermission("services:create"),
    canEditServices: () => hasPermission("services:edit"),
    canDeleteServices: () => hasPermission("services:delete"),
    canManageCareers: () => hasPermission("careers:view"),
    canCreateCareers: () => hasPermission("careers:create"),
    canEditCareers: () => hasPermission("careers:edit"),
    canDeleteCareers: () => hasPermission("careers:delete"),
    canManageNews: () => hasPermission("news:view"),
    canCreateNews: () => hasPermission("news:create"),
    canEditNews: () => hasPermission("news:edit"),
    canDeleteNews: () => hasPermission("news:delete"),
    canPublishNews: () => hasPermission("news:publish"),
    canManageUsers: () => hasPermission("users:view"),
    canCreateUsers: () => hasPermission("users:create"),
    canEditUsers: () => hasPermission("users:edit"),
    canDeleteUsers: () => hasPermission("users:delete"),
    canManagePermissions: () => hasPermission("users:manage_permissions"),
    canViewSettings: () => hasPermission("settings:view"),
    canEditSettings: () => hasPermission("settings:edit"),
    canManageSystemSettings: () => hasPermission("settings:system"),
    // Container
    canManageContainers: () => hasPermission("container:read"),
    canCreateContainers: () => hasPermission("container:create"),
    canEditContainers: () => hasPermission("container:update"),
    canDeleteContainers: () => hasPermission("container:delete"),
    // Roles
    canManageRoles: () => hasPermission("role:read"),
    canCreateRoles: () => hasPermission("role:create"),
    canEditRoles: () => hasPermission("role:update"),
    canDeleteRoles: () => hasPermission("role:delete"),
    canManageRolePermissions: () => hasPermission("role:manage_permissions"),
  };
}
