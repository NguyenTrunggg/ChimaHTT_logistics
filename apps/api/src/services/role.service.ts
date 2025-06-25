import prisma from "../config/prisma";
import { getPagination, buildPaginationResult } from "../utils/pagination";

class RoleService {
  async createRole(data: { name: string }) {
    try {
      return await prisma.role.create({ data });
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
      return await prisma.role.update({
        where: { id },
        data,
        include: { permissions: true },
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
          include: { permissions: true },
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
