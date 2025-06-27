"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ImageIcon, 
  Search, 
  Grid3X3, 
  List, 
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { uploadService, UploadedImageInfo } from '@/lib/services/upload.service';

interface ImageGalleryProps {
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
  className?: string;
  triggerText?: string;
}

export default function ImageGallery({
  onImageSelect,
  selectedImage,
  className = "",
  triggerText = "Chọn từ thư viện ảnh"
}: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<UploadedImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageInModal, setSelectedImageInModal] = useState<string>(selectedImage || '');

  // Load images using upload service
  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const allImages = await uploadService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Failed to load images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load images when modal opens
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, loadImages]);

  // Filter images based on search term
  const filteredImages = images.filter(image => 
    image.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle image selection
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageInModal(imageUrl);
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (selectedImageInModal) {
      onImageSelect(selectedImageInModal);
      setIsOpen(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb > 1 ? `${mb.toFixed(1)}MB` : `${kb.toFixed(1)}KB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          variant="outline" 
          className={`border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 hover:shadow-md rounded-xl ${className}`}
        >
          <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border-green-200 shadow-2xl">
        <DialogHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 -m-6 mb-6">
          <DialogTitle className="text-xl flex items-center gap-3 text-gray-800">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <ImageIcon className="h-6 w-6 text-green-600" />
            </div>
            Thư viện ảnh
            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredImages.length} ảnh
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search & Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm ảnh theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic"
              />
            </div>

            {/* Info & Refresh */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Hiển thị ảnh từ server và phiên làm việc</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadImages}
                disabled={loading}
                className="border-green-200 hover:border-green-400 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="border border-green-200 rounded-2xl bg-gradient-to-br from-white to-green-50 shadow-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-white rounded-2xl shadow-lg mb-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                  <p className="text-gray-600 font-medium">Đang tải ảnh...</p>
                  <p className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="p-6 bg-gray-100 rounded-3xl mb-6">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">
                    {searchTerm ? 'Không tìm thấy ảnh' : 'Chưa có ảnh nào'}
                  </h3>
                  <p className="text-sm text-center max-w-sm">
                    {searchTerm 
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc tải lên ảnh mới' 
                      : 'Hãy tải lên ảnh đầu tiên để bắt đầu xây dựng thư viện'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredImages.map((image, index) => (
                    <Card 
                      key={`${image.filename}-${index}`}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl overflow-hidden border-2 ${
                        selectedImageInModal === image.url 
                          ? 'ring-4 ring-green-400 shadow-2xl border-green-400 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300 bg-white'
                      }`}
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <CardContent className="p-3">
                        <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
                          <img 
                            src={image.url}
                            alt={image.originalName || image.filename}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                          {selectedImageInModal === image.url && (
                            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                              <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                                <Check className="h-5 w-5" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold truncate text-gray-800">
                            {image.originalName || image.filename}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              {formatFileSize(image.size)}
                            </span>
                            {image.uploadDate && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {format(new Date(image.uploadDate), 'dd/MM', { locale: vi })}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selection Info */}
          {selectedImageInModal && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-xl">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Ảnh đã chọn</p>
                  <p className="text-sm text-green-700">
                    {filteredImages.find(img => img.url === selectedImageInModal)?.originalName ||
                     filteredImages.find(img => img.url === selectedImageInModal)?.filename ||
                     'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy bỏ
            </Button>
            <Button 
              type="button"
              onClick={handleConfirmSelection}
              disabled={!selectedImageInModal}
              className="bg-gradient-to-r from-[#00b764] to-green-600 hover:from-[#00a055] hover:to-green-700 text-white px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4 mr-2" />
              Chọn ảnh này
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to add images to gallery (kept for backward compatibility)
export const addToImageGallery = (imageInfo: UploadedImageInfo) => {
  uploadService.addToLocalGallery(imageInfo);
}; 