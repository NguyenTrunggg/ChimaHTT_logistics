import prisma from "../config/prisma";
import { getPagination, buildPaginationResult } from "../utils/pagination";

class RoleService {
  async createRole(data: { name: string; permissions?: number[] }) {
    try {
      const { permissions, ...roleData } = data;
      
      const createData: any = {
        ...roleData,
      };

      // If permissions are provided, connect them using the proper Prisma syntax
      if (permissions && permissions.length > 0) {
        // Filter to only include existing permission IDs
        const existingPermissions = await prisma.permission.findMany({
          where: { id: { in: permissions } },
          select: { id: true }
        });
        
        const validPermissionIds = existingPermissions.map(p => p.id);
        
        console.log(`Requested permissions: ${permissions.length}, Valid permissions: ${validPermissionIds.length}`);
        
        if (validPermissionIds.length > 0) {
          createData.permissions = {
            connect: validPermissionIds.map(id => ({ id }))
          };
        }
      }

      return await prisma.role.create({ 
        data: createData,
        include: { permissions: true, users: true }
      });
    } catch (error) {
      throw new Error("Failed to create role: " + (error as Error).message);
    }
  }

  async getRoleById(id: number) {
    try {
      return await prisma.role.findUnique({
        where: { id },
        include: { permissions: true, users: true },
      });
    } catch (error) {
      throw new Error("Failed to get role: " + (error as Error).message);
    }
  }

  async updateRole(id: number, data: any) {
    try {
      const { permissions, ...roleData } = data;
      
      const updateData: any = {
        ...roleData,
      };

      // If permissions are provided, replace all existing permissions
      if (permissions !== undefined) {
        if (Array.isArray(permissions) && permissions.length > 0) {
          // Filter to only include existing permission IDs
          const existingPermissions = await prisma.permission.findMany({
            where: { id: { in: permissions } },
            select: { id: true }
          });
          
          const validPermissionIds = existingPermissions.map(p => p.id);
          
          console.log(`Requested permissions: ${permissions.length}, Valid permissions: ${validPermissionIds.length}`);
          
          if (validPermissionIds.length > 0) {
            updateData.permissions = {
              set: [], // Clear all existing connections
              connect: validPermissionIds.map((id: number) => ({ id }))
            };
          } else {
            // If no valid permissions, just clear all connections
            updateData.permissions = {
              set: []
            };
          }
        } else {
          // If permissions array is empty, just clear all connections
          updateData.permissions = {
            set: []
          };
        }
      }

      return await prisma.role.update({
        where: { id },
        data: updateData,
        include: { permissions: true, users: true },
      });
    } catch (error) {
      throw new Error("Failed to update role: " + (error as Error).message);
    }
  }

  async deleteRole(id: number) {
    try {
      return await prisma.role.delete({ where: { id } });
    } catch (error) {
      throw new Error("Failed to delete role: " + (error as Error).message);
    }
  }

  async listRoles(filter: any = {}) {
    try {
      // filter: { search, page, pageSize }
      const { search, page, pageSize } = filter;
      let where: any = {};
      if (search) where.name = { contains: search };
      const { skip, take } = getPagination({ page, pageSize });
      const [data, total] = await Promise.all([
        prisma.role.findMany({
          where,
          include: { permissions: true, users: true },
          skip,
          take,
          orderBy: { id: "asc" },
        }),
        prisma.role.count({ where }),
      ]);
      return buildPaginationResult(
        data,
        total,
        Number(page) || 1,
        Number(pageSize) || 10
      );
    } catch (error) {
      throw new Error("Failed to list roles: " + (error as Error).message);
    }
  }

  async addPermissionToRole(roleId: number, permissionId: number) {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: { connect: { id: permissionId } },
        },
        include: { permissions: true },
      });
    } catch (error) {
      throw new Error(
        "Failed to add permission to role: " + (error as Error).message
      );
    }
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    try {
      return await prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: { disconnect: { id: permissionId } },
        },
        include: { permissions: true },
      });
    } catch (error) {
      throw new Error(
        "Failed to remove permission from role: " + (error as Error).message
      );
    }
  }
}

export default new RoleService();
