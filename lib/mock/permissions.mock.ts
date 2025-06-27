/**
 * Mock data for testing permissions-based admin system
 */

import { Permission, User } from "@/lib/types/auth";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";

// Mock permissions data
export const mockPermissions: Permission[] = [
  // Dashboard permissions
  {
    id: "1",
    name: "View Dashboard",
    resource: "dashboard",
    action: "view"
  },
  
  // Services permissions
  {
    id: "2",
    name: "View Services",
    resource: "services",
    action: "view"
  },
  {
    id: "3",
    name: "Create Services",
    resource: "services", 
    action: "create"
  },
  {
    id: "4",
    name: "Edit Services",
    resource: "services",
    action: "edit"
  },
  {
    id: "5",
    name: "Delete Services",
    resource: "services",
    action: "delete"
  },
  
  // Careers permissions
  {
    id: "6",
    name: "View Careers",
    resource: "careers",
    action: "view"
  },
  {
    id: "7",
    name: "Create Careers",
    resource: "careers",
    action: "create"
  },
  {
    id: "8",
    name: "Edit Careers",
    resource: "careers",
    action: "edit"
  },
  {
    id: "9",
    name: "Delete Careers",
    resource: "careers",
    action: "delete"
  },
  
  // News permissions
  {
    id: "10",
    name: "View News",
    resource: "news",
    action: "view"
  },
  {
    id: "11",
    name: "Create News",
    resource: "news",
    action: "create"
  },
  {
    id: "12",
    name: "Edit News",
    resource: "news",
    action: "edit"
  },
  {
    id: "13",
    name: "Delete News",
    resource: "news",
    action: "delete"
  },
  {
    id: "14",
    name: "Publish News",
    resource: "news",
    action: "publish"
  },
  
  // Users permissions
  {
    id: "15",
    name: "View Users",
    resource: "users",
    action: "view"
  },
  {
    id: "16",
    name: "Create Users",
    resource: "users",
    action: "create"
  },
  {
    id: "17",
    name: "Edit Users",
    resource: "users",
    action: "edit"
  },
  {
    id: "18",
    name: "Delete Users",
    resource: "users",
    action: "delete"
  },
  {
    id: "19",
    name: "Manage Permissions",
    resource: "users",
    action: "manage_permissions"
  },
  
  // Settings permissions
  {
    id: "20",
    name: "View Settings",
    resource: "settings",
    action: "view"
  },
  {
    id: "21",
    name: "Edit Settings",
    resource: "settings",
    action: "edit"
  },
  {
    id: "22",
    name: "System Settings",
    resource: "settings",
    action: "system"
  },
];

// Mock user roles with different permission sets
export const mockUsers: Record<string, User> = {
  // Super Admin - all permissions
  admin: {
    id: "1",
    username: "admin",
    email: "admin@chimahtt.com",
    name: "Super Admin",
    role: "admin",
    permissions: mockPermissions
  },
  
  // Content Manager - limited permissions
  content_manager: {
    id: "2", 
    username: "content_manager",
    email: "content@chimahtt.com",
    name: "Content Manager",
    role: "moderator",
    permissions: [
      mockPermissions[0], // dashboard:view
      mockPermissions[5], // careers:view
      mockPermissions[6], // careers:create
      mockPermissions[7], // careers:edit
      mockPermissions[9], // news:view
      mockPermissions[10], // news:create
      mockPermissions[11], // news:edit
      mockPermissions[13], // news:publish
    ]
  },
  
  // Services Manager - services only
  services_manager: {
    id: "3",
    username: "services_manager", 
    email: "services@chimahtt.com",
    name: "Services Manager",
    role: "moderator",
    permissions: [
      mockPermissions[0], // dashboard:view
      mockPermissions[1], // services:view
      mockPermissions[2], // services:create
      mockPermissions[3], // services:edit
      mockPermissions[4], // services:delete
    ]
  },
  
  // Read Only User - view permissions only
  readonly_user: {
    id: "4",
    username: "readonly",
    email: "readonly@chimahtt.com", 
    name: "Read Only User",
    role: "user",
    permissions: [
      mockPermissions[0], // dashboard:view
      mockPermissions[1], // services:view
      mockPermissions[5], // careers:view
      mockPermissions[9], // news:view
      mockPermissions[14], // users:view
      mockPermissions[19], // settings:view
    ]
  }
};

// Helper to get user by username (for mock login)
export function getMockUserByUsername(username: string): User | null {
  return mockUsers[username] || null;
}

// Helper to check if user has permission
export function userHasPermission(user: User, permission: string): boolean {
  return user.permissions.some(p => `${p.resource}:${p.action}` === permission);
}

export default {
  mockPermissions,
  mockUsers,
  getMockUserByUsername,
  userHasPermission
};
