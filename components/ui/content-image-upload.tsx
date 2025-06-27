"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon, Copy } from 'lucide-react';
import { config } from '@/lib/config/app.config';
import ImageUpload, { UploadedImage } from './image-upload';

interface ContentImageUploadProps {
  onImageInsert: (markdown: string) => void;
  uploadedImages: string[];
  onImagesUpdate: (images: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export default function ContentImageUpload({
  onImageInsert,
  uploadedImages,
  onImagesUpdate,
  disabled = false,
  className = "",
}: ContentImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  // Handle content image upload
  const handleContentImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      // Convert to WebP
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const maxWidth = config.DEFAULTS.MAX_IMAGE_WIDTH;
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        img.src = URL.createObjectURL(file);
      });

      const webpBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(resolve as BlobCallback, 'image/webp', config.DEFAULTS.WEBP_QUALITY);
      });

      // Upload to server
      const formData = new FormData();
      formData.append('image', webpBlob!, `content-${Date.now()}.webp`);

      const response = await fetch(`${config.API_BASE_URL}${config.UPLOAD_ENDPOINTS.IMAGE}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      const imageUrl = `${config.API_BASE_URL.replace('/api/v1', '')}${result.data.url}`;
      
      // Add to uploaded images list
      const newImages = [...uploadedImages, imageUrl];
      onImagesUpdate(newImages);
      
      // Insert markdown image syntax
      const markdown = `![Ảnh](${imageUrl})`;
      onImageInsert(markdown);
      
    } catch (error) {
      console.error('Content image upload error:', error);
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }, [uploadedImages, onImagesUpdate, onImageInsert]);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    if (file.size > config.DEFAULTS.MAX_FILE_SIZE) {
      alert('File ảnh không được vượt quá 10MB');
      return;
    }

    await handleContentImageUpload(file);
  }, [handleContentImageUpload]);

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
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('content-image-input')?.click()}
          disabled={uploading || disabled}
          className="border-green-200 hover:border-green-400 hover:bg-green-50"
        >
          {uploading ? (
            <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1"></div>
          ) : (
            <Upload className="h-3 w-3 mr-1" />
          )}
          {uploading ? 'Uploading...' : 'Thêm ảnh'}
        </Button>
        
        <input
          id="content-image-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
          aria-label="Upload content image"
        />
      </div>

      {/* Uploaded Images Gallery */}
      {uploadedImages.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
          <h4 className="text-sm font-semibold mb-3 text-green-800 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Ảnh đã upload trong bài viết ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-6 gap-3">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Content image ${index + 1}`}
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