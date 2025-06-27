import { LoginDto, LoginResponse, User, ApiResponse } from "@/lib/types/auth";
import { apiClient } from "./api.service";
import { config } from "@/lib/config/app.config";
import { getMockUserByUsername } from "@/lib/mock/permissions.mock";

// Development mode flag - set to false for production
const USE_MOCK_API = process.env.NODE_ENV === "development" && process.env.USE_MOCK_AUTH === "true";

class AuthService {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  /**
   * Login user with username and password
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      // Use mock authentication for development/testing
      if (USE_MOCK_API) {
        return this.mockLogin(credentials);
      }

      const response = await apiClient.post<LoginResponse>(
        config.AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      // Store token
      this.token = response.token;
      if (typeof window !== "undefined") {
        localStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, response.token);
        // Set cookie for middleware (expires in 1h)
        document.cookie = `admin_session=${response.token}; path=/; max-age=3600`;
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Mock login for development/testing
   */
  private async mockLogin(credentials: LoginDto): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = getMockUserByUsername(credentials.username);
    
    if (!user || credentials.password !== "123456") {
      throw new Error("Invalid credentials");
    }

    const mockToken = `mock_token_${user.id}_${Date.now()}`;
    
    // Store mock token
    this.token = mockToken;
    if (typeof window !== "undefined") {
      localStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      // Set cookie for middleware (expires in 1h)
      document.cookie = `admin_session=${mockToken}; path=/; max-age=3600`;
    }

    return {
      token: mockToken,
      user,
      expiresIn: 3600
    };
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Use mock user for development/testing
      if (USE_MOCK_API) {
        return this.mockGetCurrentUser();
      }

      const response = await apiClient.get<User>(
        config.AUTH_ENDPOINTS.ME,
        true
      );
      return response;
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }

  /**
   * Mock get current user for development/testing
   */
  private async mockGetCurrentUser(): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(config.STORAGE_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(userData);
      }
    }

    throw new Error("No user data found");
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
    //   if (this.token) {
    //     await apiClient.post(config.AUTH_ENDPOINTS.LOGOUT, {}, true);
    //   }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      this.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(config.STORAGE_KEYS.ADMIN_USER);
        // Remove cookie
        document.cookie = "admin_session=; path=/; max-age=0";
      }
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        config.AUTH_ENDPOINTS.REFRESH,
        {},
        true
      );

      // Update token
      this.token = response.token;
      if (typeof window !== "undefined") {
        localStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, response.token);
        // Set cookie for middleware (expires in 1h)
        document.cookie = `admin_session=${response.token}; path=/; max-age=3600`;
      }

      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Set token manually
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<boolean> {
    try {
      if (!this.token) return false;

      // Call /auth/me to ensure token is still valid
      await apiClient.get(config.AUTH_ENDPOINTS.ME, true);
      return true;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }

  /**
   * Get authorization headers
   */
  getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
