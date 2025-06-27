import { config } from '@/lib/config/app.config';

export interface UploadedImageInfo {
  url: string;
  filename: string;
  originalName?: string;
  size?: number;
  uploadDate?: string;
  mimetype?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadedImageInfo;
}

export interface ImageListResponse {
  success: boolean;
  message: string;
  data: UploadedImageInfo[];
}

class UploadService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  // Upload single image
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseUrl}${config.UPLOAD_ENDPOINTS.IMAGE}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Convert relative URL to absolute URL
    if (result.success && result.data) {
      result.data.url = `${this.baseUrl.replace('/api/v1', '')}${result.data.url}`;
    }

    return result;
  }

  // Upload multiple images
  async uploadMultipleImages(files: File[]): Promise<{ success: boolean; message: string; data: UploadedImageInfo[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${this.baseUrl}${config.UPLOAD_ENDPOINTS.IMAGES}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Convert relative URLs to absolute URLs
    if (result.success && result.data) {
      result.data = result.data.map((img: any) => ({
        ...img,
        url: `${this.baseUrl.replace('/api/v1', '')}${img.url}`
      }));
    }

    return result;
  }

  // Get list of uploaded images
  async getUploadedImages(): Promise<ImageListResponse> {
    const response = await fetch(`${this.baseUrl}${config.UPLOAD_ENDPOINTS.LIST_IMAGES}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get images: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Convert relative URLs to absolute URLs
    if (result.success && result.data) {
      result.data = result.data.map((img: any) => ({
        ...img,
        url: `${this.baseUrl.replace('/api/v1', '')}${img.url}`
      }));
    }

    return result;
  }

  // Delete image
  async deleteImage(filename: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}${config.UPLOAD_ENDPOINTS.DELETE}/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Helper methods for localStorage integration
  
  // Add image to localStorage gallery
  addToLocalGallery(imageInfo: UploadedImageInfo): void {
    try {
      const storedImages = localStorage.getItem('uploaded_images');
      const existingImages: UploadedImageInfo[] = storedImages ? JSON.parse(storedImages) : [];
      
      // Check if image already exists
      const imageExists = existingImages.some(img => img.url === imageInfo.url || img.filename === imageInfo.filename);
      if (!imageExists) {
        const updatedImages = [
          { ...imageInfo, uploadDate: imageInfo.uploadDate || new Date().toISOString() },
          ...existingImages
        ];
        localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
      }
    } catch (error) {
      console.error('Failed to add image to local gallery:', error);
    }
  }

  // Get images from localStorage
  getLocalImages(): UploadedImageInfo[] {
    try {
      const storedImages = localStorage.getItem('uploaded_images');
      return storedImages ? JSON.parse(storedImages) : [];
    } catch (error) {
      console.error('Failed to load images from localStorage:', error);
      return [];
    }
  }

  // Get combined images from both server and localStorage
  async getAllImages(): Promise<UploadedImageInfo[]> {
    const allImages: UploadedImageInfo[] = [];
    
    try {
      // Load from server
      const serverResponse = await this.getUploadedImages();
      if (serverResponse.success && serverResponse.data) {
        allImages.push(...serverResponse.data);
      }
    } catch (error) {
      console.error('Failed to load images from server:', error);
    }

    try {
      // Load from localStorage
      const localImages = this.getLocalImages();
      
      // Merge with server images, avoiding duplicates
      localImages.forEach(localImg => {
        const exists = allImages.some(img => img.url === localImg.url || img.filename === localImg.filename);
        if (!exists) {
          allImages.push(localImg);
        }
      });
    } catch (error) {
      console.error('Failed to load images from localStorage:', error);
    }

    // Sort by newest first
    allImages.sort((a, b) => {
      const dateA = new Date(a.uploadDate || 0);
      const dateB = new Date(b.uploadDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return allImages;
  }
}

export const uploadService = new UploadService(); 