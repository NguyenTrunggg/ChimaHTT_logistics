import { Permission } from "@/lib/types/user";

// Define admin permissions constants
export const ADMIN_PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard:read",
  
  // Services management
  SERVICES_VIEW: "service:read",
  SERVICES_CREATE: "service:create",
  SERVICES_EDIT: "service:update",
  SERVICES_DELETE: "service:delete",
  
  // Careers management
  CAREERS_VIEW: "job:read",
  CAREERS_CREATE: "job:create",
  CAREERS_EDIT: "job:update",
  CAREERS_DELETE: "job:delete",
  CAREERS_MANAGE_APPLICATIONS: "job:manage_applications",
  
  // News management
  NEWS_VIEW: "news:read",
  NEWS_CREATE: "news:create",
  NEWS_EDIT: "news:update",
  NEWS_DELETE: "news:delete",
  NEWS_PUBLISH: "news:publish",
  
  // Users management
  USERS_VIEW: "user:read",
  USERS_CREATE: "user:create",
  USERS_EDIT: "user:update",
  USERS_DELETE: "user:delete",
  USERS_MANAGE_PERMISSIONS: "users:manage_permissions",
  
  // Roles management
  ROLES_VIEW: "role:read",
  ROLES_CREATE: "role:create",
  ROLES_EDIT: "role:update",
  ROLES_DELETE: "role:delete",
  ROLES_MANAGE_PERMISSIONS: "role:manage_permissions",
  
  // Settings
  SETTINGS_VIEW: "system-config:read",
  SETTINGS_EDIT: "system-config:update",
  SETTINGS_SYSTEM: "system-config:create",
  SETTINGS_DELETE: "system-config:delete",
  
  // Container management
  CONTAINERS_VIEW: "container:read",
  CONTAINERS_CREATE: "container:create",
  CONTAINERS_EDIT: "container:update",
  CONTAINERS_DELETE: "container:delete",
} as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

class PermissionService {
  private userPermissions: string[] = [];

  /**
   * Set user permissions
   */
  setUserPermissions(permissions: Permission[]): void {
    this.userPermissions = permissions.map(p => {
      const res = (p as any).resource ?? (p as any).subject ?? "";
      return `${res}:${p.action}`;
    });
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: AdminPermission): boolean {
    return this.userPermissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: AdminPermission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: AdminPermission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Check if user can access admin dashboard
   */
  canAccessAdmin(): boolean {
    return this.hasPermission(ADMIN_PERMISSIONS.DASHBOARD_VIEW);
  }

  /**
   * Check if user can manage services
   */
  canManageServices(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.SERVICES_VIEW,
      ADMIN_PERMISSIONS.SERVICES_CREATE,
      ADMIN_PERMISSIONS.SERVICES_EDIT,
      ADMIN_PERMISSIONS.SERVICES_DELETE,
    ]);
  }

  /**
   * Check if user can manage careers
   */
  canManageCareers(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.CAREERS_VIEW,
      ADMIN_PERMISSIONS.CAREERS_CREATE,
      ADMIN_PERMISSIONS.CAREERS_EDIT,
      ADMIN_PERMISSIONS.CAREERS_DELETE,
    ]);
  }

  /**
   * Check if user can manage news
   */
  canManageNews(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.NEWS_VIEW,
      ADMIN_PERMISSIONS.NEWS_CREATE,
      ADMIN_PERMISSIONS.NEWS_EDIT,
      ADMIN_PERMISSIONS.NEWS_DELETE,
    ]);
  }

  /**
   * Check if user can manage users
   */
  canManageUsers(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.USERS_VIEW,
      ADMIN_PERMISSIONS.USERS_CREATE,
      ADMIN_PERMISSIONS.USERS_EDIT,
      ADMIN_PERMISSIONS.USERS_DELETE,
    ]);
  }

  /**
   * Check if user can access settings
   */
  canAccessSettings(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.SETTINGS_VIEW,
      ADMIN_PERMISSIONS.SETTINGS_EDIT,
      ADMIN_PERMISSIONS.SETTINGS_SYSTEM,
    ]);
  }

  /**
   * Get all user permissions
   */
  getUserPermissions(): string[] {
    return [...this.userPermissions];
  }

  /**
   * Clear all permissions
   */
  clearPermissions(): void {
    this.userPermissions = [];
  }

  /**
   * Get permissions for a specific resource
   */
  getResourcePermissions(resource: string): string[] {
    return this.userPermissions.filter(permission => 
      permission.startsWith(`${resource}:`)
    );
  }

  /**
   * Check if user can manage containers
   */
  canManageContainers(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.CONTAINERS_VIEW,
      ADMIN_PERMISSIONS.CONTAINERS_CREATE,
      ADMIN_PERMISSIONS.CONTAINERS_EDIT,
      ADMIN_PERMISSIONS.CONTAINERS_DELETE,
    ]);
  }

  /**
   * Check if user can manage roles
   */
  canManageRoles(): boolean {
    return this.hasAnyPermission([
      ADMIN_PERMISSIONS.ROLES_VIEW,
      ADMIN_PERMISSIONS.ROLES_CREATE,
      ADMIN_PERMISSIONS.ROLES_EDIT,
      ADMIN_PERMISSIONS.ROLES_DELETE,
    ]);
  }
}

// Export singleton instance
export const permissionService = new PermissionService();
export default permissionService;
