"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, ImageIcon, Copy } from 'lucide-react';
import { config } from '@/lib/config/app.config';
import { uploadService } from '@/lib/services/upload.service';

export interface UploadedImage {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

interface ImageUploadProps {
  // Single image upload (for main image)
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (image: UploadedImage) => void;
  
  // Multiple images (for content gallery)
  multiple?: boolean;
  onMultipleUpload?: (images: UploadedImage[]) => void;
  uploadedImages?: string[];
  
  // UI customization
  placeholder?: string;
  showPreview?: boolean;
  showUrlInput?: boolean;
  className?: string;
  previewClassName?: string;
  
  // Behavior
  autoUpload?: boolean; // Auto upload on file select
  dragAndDrop?: boolean;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  multiple = false,
  onMultipleUpload,
  uploadedImages = [],
  placeholder = "Nhập URL ảnh hoặc upload file...",
  showPreview = true,
  showUrlInput = true,
  className = "",
  previewClassName = "",
  autoUpload = true,
  dragAndDrop = true,
  disabled = false,
}: ImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert image to WebP format
  const convertToWebP = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Resize if too large
        const maxWidth = config.DEFAULTS.MAX_IMAGE_WIDTH;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and convert to WebP
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve as BlobCallback, 'image/webp', config.DEFAULTS.WEBP_QUALITY);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return false;
    }

    if (file.size > config.DEFAULTS.MAX_FILE_SIZE) {
      alert('File ảnh không được vượt quá 10MB');
      return false;
    }

    return true;
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Auto upload if enabled
    if (autoUpload) {
      await uploadFile(file);
    }
  }, [autoUpload, validateFile]);

  // Upload file to server
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      
      const formData = new FormData();
      const filename = multiple ? `content-${Date.now()}.webp` : `image-${Date.now()}.webp`;
      formData.append('image', webpBlob, filename);

      const response = await fetch(`${config.API_BASE_URL}${config.UPLOAD_ENDPOINTS.IMAGE}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      const imageUrl = `${config.API_BASE_URL.replace('/api/v1', '')}${result.data.url}`;
      
      // Add to image gallery for future selection
      uploadService.addToLocalGallery({
        url: imageUrl,
        filename: result.data.filename,
        originalName: result.data.originalName,
        size: result.data.size,
        uploadDate: new Date().toISOString()
      });
      
      // Update state and callback
      const uploadedImage: UploadedImage = {
        url: imageUrl,
        filename: result.data.filename,
        originalName: result.data.originalName,
        size: result.data.size,
      };

      // Handle single upload
      if (!multiple) {
        onChange?.(imageUrl);
        onUpload?.(uploadedImage);
      } else {
        // Handle multiple upload
        onMultipleUpload?.([uploadedImage]);
      }

      // Reset states
      setImageFile(null);
      setImagePreview("");
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }, [convertToWebP, multiple, onChange, onUpload, onMultipleUpload]);

  // Manual upload trigger
  const handleUpload = useCallback(() => {
    if (imageFile) {
      uploadFile(imageFile);
    }
  }, [imageFile, uploadFile]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragAndDrop && !disabled) {
      setDragActive(true);
    }
  }, [dragAndDrop, disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Vui lòng kéo thả file ảnh');
      return;
    }

    const file = imageFiles[0];
    if (!validateFile(file)) return;

    await uploadFile(file);
  }, [disabled, validateFile, uploadFile]);

  // Copy image URL
  const copyImageUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(`![Ảnh](${url})`);
      alert('Đã copy markdown image syntax!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Copy thất bại');
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current/Preview Image */}
      {showPreview && (value || imagePreview) && (
        <div className={`relative w-full max-w-md ${previewClassName}`}>
          <img 
            src={imagePreview || value} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-xl border border-green-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
          {imagePreview && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setImagePreview("");
                setImageFile(null);
              }}
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Upload Interface */}
      <div 
        className={`border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
          dragActive 
            ? 'border-green-400 bg-green-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-green-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {dragActive && (
          <div className="absolute inset-0 bg-green-100/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
            <div className="text-center p-6">
              <Upload className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-800">Thả ảnh vào đây</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {showUrlInput && (
            <div className="flex-1">
              <Input 
                value={value || ''} 
                onChange={(e) => onChange?.(e.target.value)}
                className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl"
                placeholder={placeholder}
                disabled={disabled}
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="border-green-200 hover:border-green-400 hover:bg-green-50"
            >
              {uploading ? (
                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <Upload className="h-3 w-3 mr-1" />
              )}
              {uploading ? 'Uploading...' : 'Upload ảnh'}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
          aria-label="Upload image file"
          ref={fileInputRef}
        />

        {/* Upload info */}
        <div className="text-xs text-gray-500 flex items-center gap-4 mt-2">
          <span>📁 Hỗ trợ: JPG, PNG, WebP (tối đa 10MB)</span>
          <span>🚀 Tự động tối ưu thành WebP</span>
          {dragAndDrop && <span>🎯 Kéo thả để upload</span>}
        </div>
      </div>

      {/* Multiple Images Gallery */}
      {multiple && uploadedImages.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
          <h4 className="text-sm font-semibold mb-3 text-green-800 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Ảnh đã upload ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-6 gap-3">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => copyImageUrl(url)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                    title="Copy markdown syntax"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
            💡 Hover vào ảnh và click để copy markdown syntax • 
            <span className="font-mono bg-green-100 px-2 py-1 rounded">![Ảnh](url)</span>
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to add images to localStorage gallery
const addToImageGallery = (imageInfo: any) => {
  try {
    const storedImages = localStorage.getItem('uploaded_images');
    const existingImages = storedImages ? JSON.parse(storedImages) : [];
    
    const imageExists = existingImages.some((img: any) => img.url === imageInfo.url);
    if (!imageExists) {
      const updatedImages = [
        { ...imageInfo, uploadDate: new Date().toISOString() },
        ...existingImages
      ];
      localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
    }
  } catch (error) {
    console.error('Failed to add image to gallery:', error);
  }
}; 