import prisma from "../config/prisma";
import { getPagination, buildPaginationResult } from "../utils/pagination";

class UserService {
  async createUser(data: {
    username: string;
    password_hash: string;
    role_id: number;
  }) {
    try {
      return await prisma.user.create({
        data,
        include: { role: true },
      });
    } catch (error) {
      throw new Error("Failed to create user: " + (error as Error).message);
    }
  }

  async getUserById(id: number) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: { role: true, },
      });
    } catch (error) {
      throw new Error("Failed to get user: " + (error as Error).message);
    }
  }

  async updateUser(id: number, data: any) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        include: { role: true },
      });
    } catch (error) {
      throw new Error("Failed to update user: " + (error as Error).message);
    }
  }

  async deleteUser(id: number) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete user: " + (error as Error).message);
    }
  }

  async listUsers(filter: any = {}) {
    try {
      // filter: { role_id, search, page, pageSize }
      const { role_id, search, page, pageSize } = filter;
      let where: any = {};
      if (role_id) where.role_id = role_id;
      if (search) {
        where.username = { contains: search };
      }
      const { skip, take } = getPagination({ page, pageSize });
      const [data, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: { role: true },
          skip,
          take,
          orderBy: { id: "desc" },
        }),
        prisma.user.count({ where }),
      ]);
      return buildPaginationResult(
        data,
        total,
        Number(page) || 1,
        Number(pageSize) || 10
      );
    } catch (error) {
      throw new Error("Failed to list users: " + (error as Error).message);
    }
  }

  async changeUserRole(id: number, roleId: number) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { role_id: roleId },
        include: { role: true },
      });
    } catch (error) {
      throw new Error(
        "Failed to change user role: " + (error as Error).message
      );
    }
  }
}

export default new UserService();
