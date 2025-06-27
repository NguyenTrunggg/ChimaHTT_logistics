import { CrudService } from "./crud.service";
import { SystemConfig } from "@/lib/types/config";
import { apiClient } from "./api.service";

class SystemConfigService extends CrudService<SystemConfig> {
  protected endpoint = "/system-configs";
  // Endpoints are protected; mark list as authenticated true.
  protected authenticated = true;

  /**
   * Get all system configurations as key-value pairs
   */
  async getAllConfigs(): Promise<{ [key: string]: string }> {
    try {
      const configs = await this.list();
      const configMap: { [key: string]: string } = {};
      configs.forEach(config => {
        configMap[config.key] = config.value;
      });
      return configMap;
    } catch (error) {
      console.error("Failed to fetch system configs:", error);
      throw error;
    }
  }

  /**
   * Get specific config by key
   */
  async getConfig(key: string): Promise<string | null> {
    try {
      const response = await apiClient.get<SystemConfig>(`${this.endpoint}/${key}`, this.authenticated);
      return (response as any).data?.value || (response as any).value || null;
    } catch (error) {
      console.error(`Failed to fetch config for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Update or create a config
   */
  async setConfig(key: string, value: string): Promise<SystemConfig> {
    try {
      // Try to update first
      const response = await apiClient.put<SystemConfig>(`${this.endpoint}/${key}`, {
        value
      }, this.authenticated);
      return response as SystemConfig;
    } catch (error: any) {
      // If update fails (404), try to create
      if (error.message?.includes('404')) {
        return await this.createConfig(key, value);
      }
      throw error;
    }
  }

  /**
   * Create a new config
   */
  async createConfig(key: string, value: string): Promise<SystemConfig> {
    try {
      const response = await apiClient.post<SystemConfig>(this.endpoint, {
        key,
        value
      }, this.authenticated);
      return response as SystemConfig;
    } catch (error) {
      console.error(`Failed to create config for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a config
   */
  async deleteConfig(key: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.endpoint}/${key}`, this.authenticated);
      return true;
    } catch (error) {
      console.error(`Failed to delete config for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all API keys for Gemini services
   */
  async getApiKeys(): Promise<{ 
    GEMINI_API_KEY_NEWS: string;
    GEMINI_API_KEY_JOB: string;
    GEMINI_API_KEY_SERVICE: string;
  }> {
    try {
      const configs = await this.getAllConfigs();
      return {
        GEMINI_API_KEY_NEWS: configs.GEMINI_API_KEY_NEWS || "",
        GEMINI_API_KEY_JOB: configs.GEMINI_API_KEY_JOB || "",
        GEMINI_API_KEY_SERVICE: configs.GEMINI_API_KEY_SERVICE || "",
      };
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
      return {
        GEMINI_API_KEY_NEWS: "",
        GEMINI_API_KEY_JOB: "",
        GEMINI_API_KEY_SERVICE: "",
      };
    }
  }

  /**
   * Update API keys
   */
  async updateApiKeys(apiKeys: { 
    GEMINI_API_KEY_NEWS?: string;
    GEMINI_API_KEY_JOB?: string;
    GEMINI_API_KEY_SERVICE?: string;
  }): Promise<boolean> {
    try {
      const promises = Object.entries(apiKeys)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => this.setConfig(key, value!));
      
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error("Failed to update API keys:", error);
      throw error;
    }
  }

  /**
   * Test API key validity by calling the backend test endpoint
   */
  async testApiKey(key: string, value: string): Promise<boolean> {
    if (!value || value.trim() === "") {
      return false;
    }

    try {
      const response = await apiClient.post<{
        valid: boolean;
        message: string;
        key: string;
      }>(`${this.endpoint}/test-api-key`, {
        key,
        value
      }, this.authenticated);
      
      return (response as any).valid || false;
    } catch (error: any) {
      console.error(`Failed to test API key ${key}:`, error);
      
      // Check if it's a validation error (400)
      if (error.message?.includes('Invalid API key format')) {
        return false;
      }
      
      // For network errors or other issues, return false
      return false;
    }
  }

  /**
   * Get usage statistics (mock implementation)
   */
  async getUsageStats(): Promise<{
    apiCallsToday: number;
    tokensUsed: number;
    tokensLimit: number;
    costThisMonth: number;
    budget: number;
  }> {
    try {
      // Mock implementation - replace with actual usage tracking
      return {
        apiCallsToday: Math.floor(Math.random() * 500) + 100,
        tokensUsed: Math.floor(Math.random() * 50000) + 10000,
        tokensLimit: 100000,
        costThisMonth: Math.floor(Math.random() * 50) + 10,
        budget: 100,
      };
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
      return {
        apiCallsToday: 0,
        tokensUsed: 0,
        tokensLimit: 100000,
        costThisMonth: 0,
        budget: 100,
      };
    }
  }
}

export const systemConfigService = new SystemConfigService();
export default systemConfigService; 