"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { permissionService, ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import { Role, Permission } from "@/lib/types/user";
import { config } from "@/lib/config/app.config";

// Extended user type for admin context with proper role structure
interface AdminUserData {
  id: number | string;
  username: string;
  email?: string | null;
  name?: string | null;
  role?: Role; // Use the Role type from user.ts
}

interface AdminUser {
  id: number | string;
  email?: string | null;
  name?: string | null;
  username?: string;
  role?: Role;
  permissions: Permission[];
}

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessAdmin: () => boolean;
  getDefaultRedirectPath: () => string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra session từ localStorage khi component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const isValid = await authService.verifyToken();
        if (isValid) {
          const userData = await authService.getCurrentUser();
          
          // Cast to AdminUserData to access role.permissions safely
          const adminUserData = userData as unknown as AdminUserData;
          
          // Extract permissions from user.role.permissions
          const permissions = adminUserData.role?.permissions || [];
          console.log("User permissions:", permissions);
          
          // Set permissions in permission service
          permissionService.setUserPermissions(permissions);
          
          // Check if user has any admin permissions (not just dashboard)
          const hasAnyAdminPermission = permissionService.hasAnyPermission([
            ADMIN_PERMISSIONS.DASHBOARD_VIEW,
            ADMIN_PERMISSIONS.SERVICES_VIEW,
            ADMIN_PERMISSIONS.NEWS_VIEW,
            ADMIN_PERMISSIONS.CAREERS_VIEW,
            ADMIN_PERMISSIONS.USERS_VIEW,
            ADMIN_PERMISSIONS.ROLES_VIEW,
            ADMIN_PERMISSIONS.CONTAINERS_VIEW,
            ADMIN_PERMISSIONS.SETTINGS_VIEW,
          ]);
          
          if (hasAnyAdminPermission) {
            const adminUser: AdminUser = {
              id: adminUserData.id,
              email: adminUserData.email,
              name: adminUserData.name || adminUserData.username,
              username: adminUserData.username,
              role: adminUserData.role,
              permissions,
            };

            setUser(adminUser);
            
            // Set session cookie
            if (typeof window !== "undefined") {
              document.cookie = `admin_session=${authService.getToken()}; path=/; max-age=3600`;
            }
          } else {
            console.warn("User does not have any admin permissions");
            await authService.logout();
          }
        } else {
          // Token invalid, clear it
          await authService.logout();
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });

      if (response.token) {
        // Get user data after successful login
        const userData = await authService.getCurrentUser();
        
        // Cast to AdminUserData to access role.permissions safely
        const adminUserData = userData as unknown as AdminUserData;

        // Extract permissions from user.role.permissions
        const permissions = adminUserData.role?.permissions || [];
        console.log("Login - User permissions:", permissions);
        
        // Set permissions in permission service
        permissionService.setUserPermissions(permissions);

        // Check if user has any admin permissions (not just dashboard)
        const hasAnyAdminPermission = permissionService.hasAnyPermission([
          ADMIN_PERMISSIONS.DASHBOARD_VIEW,
          ADMIN_PERMISSIONS.SERVICES_VIEW,
          ADMIN_PERMISSIONS.NEWS_VIEW,
          ADMIN_PERMISSIONS.CAREERS_VIEW,
          ADMIN_PERMISSIONS.USERS_VIEW,
          ADMIN_PERMISSIONS.ROLES_VIEW,
          ADMIN_PERMISSIONS.CONTAINERS_VIEW,
          ADMIN_PERMISSIONS.SETTINGS_VIEW,
        ]);
        
        if (hasAnyAdminPermission) {
          const adminUser: AdminUser = {
            id: adminUserData.id,
            email: adminUserData.email,
            name: adminUserData.name || adminUserData.username,
            username: adminUserData.username,
            role: adminUserData.role,
            permissions,
          };

          setUser(adminUser);
          localStorage.setItem(
            config.STORAGE_KEYS.ADMIN_USER,
            JSON.stringify(adminUser)
          );
          
          // Set session cookie
          if (typeof window !== "undefined") {
            document.cookie = `admin_session=${authService.getToken()}; path=/; max-age=3600`;
          }
          return true;
        } else {
          // User doesn't have any admin permissions
          await authService.logout();
          throw new Error("Unauthorized: Admin permissions required");
        }
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      permissionService.clearPermissions();
      localStorage.removeItem(config.STORAGE_KEYS.ADMIN_USER);
      
      // Clear session cookie
      if (typeof window !== "undefined") {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      permissionService.clearPermissions();
      localStorage.removeItem(config.STORAGE_KEYS.ADMIN_USER);
      
      // Clear session cookie
      if (typeof window !== "undefined") {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      
      router.push("/admin/login");
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissionService.hasPermission(permission as any);
  };

  const canAccessAdmin = (): boolean => {
    // Check if user has any admin permissions (not just dashboard)
    return permissionService.hasAnyPermission([
      ADMIN_PERMISSIONS.DASHBOARD_VIEW,
      ADMIN_PERMISSIONS.SERVICES_VIEW,
      ADMIN_PERMISSIONS.NEWS_VIEW,
      ADMIN_PERMISSIONS.CAREERS_VIEW,
      ADMIN_PERMISSIONS.USERS_VIEW,
      ADMIN_PERMISSIONS.ROLES_VIEW,
      ADMIN_PERMISSIONS.CONTAINERS_VIEW,
      ADMIN_PERMISSIONS.SETTINGS_VIEW,
    ]);
  };

  /**
   * Get the best redirect path for user based on their permissions
   */
  const getDefaultRedirectPath = (): string => {
    // Priority order: dashboard -> services -> news -> careers -> users -> roles -> containers -> settings
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.DASHBOARD_VIEW)) {
      return "/admin/dashboard";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.SERVICES_VIEW)) {
      return "/admin/services";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.NEWS_VIEW)) {
      return "/admin/news";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.CAREERS_VIEW)) {
      return "/admin/careers";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.USERS_VIEW)) {
      return "/admin/users";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.ROLES_VIEW)) {
      return "/admin/roles";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.CONTAINERS_VIEW)) {
      return "/admin/containers";
    }
    if (permissionService.hasPermission(ADMIN_PERMISSIONS.SETTINGS_VIEW)) {
      return "/admin/settings";
    }
    
    // Fallback: if no specific permissions, try dashboard anyway
    return "/admin/dashboard";
  };

  const isAuthenticated = !!user && authService.isAuthenticated();

  return (
    <AdminAuthContext.Provider
      value={{ 
        user, 
        login, 
        logout, 
        isLoading, 
        isAuthenticated, 
        hasPermission, 
        canAccessAdmin,
        getDefaultRedirectPath
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
