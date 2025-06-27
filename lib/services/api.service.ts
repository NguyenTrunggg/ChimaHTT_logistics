import { authService } from "./auth.service";
import { config } from "@/lib/config/app.config";

export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  authenticated?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || config.API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      authenticated = false,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authentication header if required
    if (authenticated) {
      const token = authService.getToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, authenticated = false): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", authenticated });
  }

  // POST request
  async post<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body,
      authenticated,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body,
      authenticated,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, authenticated = false): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", authenticated });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body,
      authenticated,
    });
  }

  // Upload file
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    authenticated = true
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers: Record<string, string> = {};

    if (authenticated) {
      const token = authService.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
