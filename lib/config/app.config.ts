// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://103.130.216.84:5000/api/v1",

  // Authentication endpoints
  AUTH_ENDPOINTS: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
    ME: "/auth/me",
  },

  // Admin endpoints
  ADMIN_ENDPOINTS: {
    SERVICES: "/admin/services",
    CAREERS: "/admin/careers",
    NEWS: "/admin/news",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },

  // Public endpoints
  PUBLIC_ENDPOINTS: {
    SERVICES: "/services",
    CAREERS: "/careers",
    NEWS: "/news",
    CONTACT: "/contact",
  },

  // Upload endpoints
  UPLOAD_ENDPOINTS: {
    IMAGE: "/upload/image",
    IMAGES: "/upload/images",
    LIST_IMAGES: "/upload/images",
    DELETE: "/upload/image",
  },

  // App Configuration
  APP_NAME: "ChimaHTT Logistics Admin",
  APP_VERSION: "1.0.0",

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    ADMIN_USER: "admin_user",
    LANGUAGE: "language",
  },

  // Default values
  DEFAULTS: {
    LANGUAGE: "vi",
    PAGINATION_LIMIT: 20,
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    WEBP_QUALITY: 0.85,
    MAX_IMAGE_WIDTH: 1920,
  },
} as const;

export default config;
