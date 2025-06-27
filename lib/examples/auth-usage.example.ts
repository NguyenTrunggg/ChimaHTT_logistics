/**
 * Auth Service Usage Examples
 *
 * This file demonstrates how to use the auth service in your components
 */

import { authService } from "@/lib/services/auth.service";
import { useAdminAuth } from "@/contexts/admin-auth-context";

// Example 1: Using auth service directly
async function loginExample() {
  try {
    const response = await authService.login({
      username: "admin",
      password: "admin123",
    });

    console.log("Login successful:", response);

    // Get user data
    const user = await authService.getCurrentUser();
    console.log("User data:", user);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Example 2: Using admin auth context in components (pseudo code)
function useComponentExample() {
  const { user, login, logout, isLoading, isAuthenticated } = useAdminAuth();

  const handleLogin = async () => {
    const success = await login("admin", "admin123");
    if (success) {
      console.log("Logged in successfully");
    }
  };

  const handleLogout = async () => {
    await logout();
    console.log("Logged out successfully");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    handleLogin,
    handleLogout,
  };
}

// Example 3: Making authenticated API calls
async function makeAuthenticatedCall() {
  try {
    // Using apiClient directly
    const { apiClient } = await import("@/lib/services/api.service");

    const data = await apiClient.get("/admin/dashboard", true);
    console.log("Dashboard data:", data);
  } catch (error) {
    console.error("API call failed:", error);
  }
}

// Example 4: Token management
function tokenExample() {
  // Check if user is authenticated
  const isAuth = authService.isAuthenticated();
  console.log("Is authenticated:", isAuth);

  // Get current token
  const token = authService.getToken();
  console.log("Current token:", token);

  // Set token manually (if received from elsewhere)
  authService.setToken("your-jwt-token-here");
}

// Example 5: Error handling patterns
async function errorHandlingExample() {
  try {
    await authService.login({ username: "admin", password: "wrong" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        console.log("Invalid credentials");
      } else if (error.message.includes("network")) {
        console.log("Network error");
      } else {
        console.log("Unknown error:", error.message);
      }
    }
  }
}

export {
  loginExample,
  useComponentExample,
  makeAuthenticatedCall,
  tokenExample,
  errorHandlingExample,
};
