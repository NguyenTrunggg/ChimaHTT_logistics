import prisma from "../config/prisma";

export const listConfigs = async () => {
  return prisma.systemConfig.findMany();
};

export const getConfig = async (key: string) => {
  return prisma.systemConfig.findUnique({ where: { key } });
};

export const createConfig = async (key: string, value: string) => {
  try {
    return await prisma.systemConfig.create({ data: { key, value } });
  } catch (error: any) {
    if (error.code === "P2002") throw new Error("Key already exists");
    throw error;
  }
};

export const updateConfig = async (key: string, value: string) => {
  return prisma.systemConfig.update({ where: { key }, data: { value } });
};

export const deleteConfig = async (key: string) => {
  return prisma.systemConfig.delete({ where: { key } });
};
