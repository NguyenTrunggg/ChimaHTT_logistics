"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { servicesService, LogisticService } from "@/lib/services";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/image-upload";
import ImageGallery from "@/components/ui/image-gallery";
import { 
  Eye, 
  Edit, 
  Save, 
  Wrench,
  AlertCircle,
  Plus,
  Trash2,
  GripVertical,
  List,
  Image as ImageIcon,
  Star
} from "lucide-react";

const serviceSchema = z.object({
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
  main_image: z.string().min(1, "Vui lòng chọn ảnh chính"),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
  features: z.array(z.object({
    item: z.string()
  })).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: LogisticService;
}

// Helper function to parse features - handle both array and object formats
const parseFeaturesOrDefault = (features: any) => {
  if (!features) return [{ item: "" }];
  
  // If it's already an array of objects with 'item' property
  if (Array.isArray(features) && features.length > 0 && typeof features[0] === 'object' && 'item' in features[0]) {
    return features;
  }
  
  // If it's an array of strings
  if (Array.isArray(features)) {
    return features.map(item => ({ item: String(item) }));
  }
  
  // If it's an object (Record<string, any> from backend)
  if (typeof features === 'object') {
    return Object.values(features).map(value => ({ item: String(value) }));
  }
  
  return [{ item: "" }];
};

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [features, setFeatures] = useState(parseFeaturesOrDefault(initialData?.translations[0]?.features));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData
      ? {
          title: initialData.translations[0]?.title || "",
          main_image: initialData.main_image,
          content: initialData.translations[0]?.content || "",
          features: parseFeaturesOrDefault(initialData.translations[0]?.features),
        }
      : {
          title: "",
          main_image: "",
          content: "",
          features: [{ item: "" }],
        },
  });

  // Sync features state with form state
  useEffect(() => {
    setValue('features', features);
  }, [features, setValue]);

  // Watch specific fields for live preview
  const watchedTitle = useWatch({ control, name: "title" });
  const watchedContent = useWatch({ control, name: "content" });
  const watchedMainImage = useWatch({ control, name: "main_image" });

  // Memoize values to prevent unnecessary re-renders
  const memoizedPreviewData = useMemo(() => ({
    title: watchedTitle,
    content: watchedContent,
    main_image: watchedMainImage
  }), [watchedTitle, watchedContent, watchedMainImage]);

  const updateFeature = (index: number, value: string) => {
    setFeatures(prev => {
      const arr = [...prev];
      arr[index] = { item: value };
      setValue('features', arr);
      return arr;
    });
  };

  const addFeature = () => {
    setFeatures(prev => {
      const newFeatures = [...prev, { item: "" }];
      setValue('features', newFeatures);
      return newFeatures;
    });
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => {
      if (prev.length <= 1) return prev;
      const newFeatures = prev.filter((_, i) => i !== index);
      setValue('features', newFeatures);
      return newFeatures;
    });
  };

  const onSubmit = async (values: ServiceFormValues) => {
    setLoading(true);
    try {
      console.log("Form values:", values);
      console.log("Features state:", features);
      console.log("Form errors:", errors);
      
      // Convert features array to object format that backend expects
      const featuresArray = features
        .filter(f => f.item && f.item.trim())
        .map(f => f.item.trim());

      // Convert array to object with numeric keys (backend expects Record<string, any>)
      const featuresObject = featuresArray.reduce((acc, feature, index) => {
        acc[index.toString()] = feature;
        return acc;
      }, {} as Record<string, string>);

      const payload = {
        title: values.title,
        main_image: values.main_image,
        content: values.content,
        features: featuresObject, // Send as object instead of array
      };

      console.log("Final payload:", payload);

      if (initialData) {
        await servicesService.update(initialData.id, payload as any);
      } else {
        await servicesService.create(payload as any);
      }

      reset();
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Lưu không thành công");
    } finally {
      setLoading(false);
    }
  };

  // Memoized image component to prevent reload on title/content changes
  const PreviewImage = useMemo(() => {
    if (!memoizedPreviewData.main_image) return null;
    
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <img 
          src={memoizedPreviewData.main_image} 
          alt="Service preview" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
          loading="lazy"
        />
      </div>
    );
  }, [memoizedPreviewData.main_image]);

  const PreviewCard = () => (
    <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 h-fit sticky top-4 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-2xl shadow-sm">
            <Eye className="h-5 w-5 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Xem trước</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Preview */}
          <div className="space-y-4">
            {PreviewImage}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-green-600" />
                {memoizedPreviewData.title || "Tên dịch vụ"}
              </h2>
              
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {memoizedPreviewData.content || "Mô tả dịch vụ sẽ hiển thị ở đây..."}
              </p>
            </div>
          </div>

          {/* Features Preview */}
          {features.some(f => f.item && f.item.trim()) && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
                Tính năng dịch vụ
              </h3>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
                <ul className="space-y-2">
                  {features
                    .filter(f => f.item && f.item.trim())
                    .map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{feature.item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form Section - Takes 2/3 width on xl screens */}
      <div className="xl:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-green-50 border border-green-200 rounded-2xl p-1">
            <TabsTrigger value="edit" className="data-[state=active]:bg-white data-[state=active]:text-green-700 rounded-xl transition-all duration-200">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white data-[state=active]:text-green-700 xl:hidden rounded-xl transition-all duration-200">
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Wrench className="h-5 w-5 text-green-600" />
                    </div>
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      Tên dịch vụ *
                    </label>
                    <Input 
                      {...register("title")} 
                      className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      placeholder="Nhập tên dịch vụ..."
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.title.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-pink-600" />
                      Ảnh chính *
                    </label>
                    
                    <ImageUpload 
                      value={memoizedPreviewData.main_image}
                      onChange={(url) => setValue('main_image', url)}
                      placeholder="Nhập URL ảnh hoặc upload file..."
                      showPreview={true}
                      showUrlInput={true}
                      autoUpload={true}
                      dragAndDrop={true}
                    />
                    
                    {/* Image Gallery for selecting previously uploaded images */}
                    <div className="mt-3">
                      <ImageGallery 
                        onImageSelect={(imageUrl) => setValue('main_image', imageUrl)}
                        selectedImage={memoizedPreviewData.main_image}
                        triggerText="Chọn từ ảnh đã tải lên"
                        className="w-full"
                      />
                    </div>
                    
                    {errors.main_image && (
                      <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.main_image.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      Mô tả dịch vụ *
                    </label>
                    <Textarea 
                      rows={6} 
                      {...register("content")} 
                      className="border-green-200 focus:border-green-400 focus:ring-green-200 resize-none rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      placeholder="Nhập mô tả chi tiết về dịch vụ..."
                    />
                    {errors.content && (
                      <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.content.message}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <List className="h-5 w-5 text-blue-600" />
                    </div>
                    Tính năng chi tiết
                    <Badge variant="secondary" className="ml-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Tuỳ chọn</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {features.map((field, index) => (
                      <div key={index} className="flex gap-3 group">
                        <div className="flex items-center text-gray-400">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={field.item}
                            onChange={(e)=>updateFeature(index, e.target.value)}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-10 rounded-xl transition-all duration-200 hover:shadow-sm placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                            placeholder={`Tính năng ${index + 1}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          disabled={features.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 self-start mt-1 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addFeature()}
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 border-dashed rounded-xl transition-all duration-200 hover:shadow-md py-3 mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tính năng mới
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/services")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00b764] to-green-600 hover:from-[#00a055] hover:to-green-700 text-white px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang lưu...
                    </div>
                  ) : initialData ? (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Cập nhật dịch vụ
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo dịch vụ mới
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="xl:hidden">
            <PreviewCard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Section - Takes 1/3 width on xl screens, hidden on smaller */}
      <div className="hidden xl:block">
        <PreviewCard />
      </div>
    </div>
  );
} 