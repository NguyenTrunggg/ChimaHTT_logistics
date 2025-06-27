import prisma from "../config/prisma";
import { testApiKeyValue } from "../utils/gemini-translate";

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

/**
 * Test if a Gemini API key is valid using the existing gemini-translate infrastructure
 */
export const testGeminiApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    console.log(`Testing API key: ${apiKey.substring(0, 10)}...`);
    
    // Use the testApiKeyValue function from gemini-translate.ts
    const isValid = await testApiKeyValue(apiKey);
    
    console.log(`API Key test result: ${isValid ? 'VALID' : 'INVALID'}`);
    
    return isValid;
    
  } catch (error: any) {
    console.error("Error testing Gemini API key:", error);
    return false;
  }
};
