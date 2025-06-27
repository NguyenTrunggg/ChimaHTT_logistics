"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { newsService, NewsArticle } from "@/lib/services";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  Edit, 
  Save, 
  Newspaper,
  AlertCircle,
  Plus,
  Image as ImageIcon,
  Tag as TagIcon,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import dynamic from "next/dynamic";
import Image from "next/image";
import ImageUpload from "@/components/ui/image-upload";
import ContentImageUpload from "../../ui/content-image-upload";
import { marked } from 'marked';
import ImageGallery from "@/components/ui/image-gallery";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Dynamically import MDEditor with error fallback
const MDEditor = dynamic(() => import('@uiw/react-md-editor').catch(() => {
  return () => null;
}), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Đang tải editor...</div>
});

const newsSchema = z.object({
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
  main_image: z.string().min(1, "Vui lòng chọn ảnh chính"),
  category_id: z.string().min(1, "Vui lòng chọn danh mục"),
  tag: z.string().optional(),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
});

export type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
  initialData?: NewsArticle;
  categories: { id: number; name: string }[];
}

export default function NewsForm({ initialData, categories }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [uploadedContentImages, setUploadedContentImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData ? {
      title: initialData.NewsTranslation?.[0]?.title || "",
      main_image: initialData.main_image || "",
      category_id: initialData.NewsCategory?.id ? String(initialData.NewsCategory.id) : "",
      tag: initialData.tag || "",
      content: initialData.NewsTranslation?.[0]?.content || "",
    } : {
      title: "",
      main_image: "",
      category_id: "",
      tag: "",
      content: "",
    },
  });

  // Watch specific fields for live preview to optimize performance
  const watchedTitle = useWatch({ control, name: "title" });
  const watchedMainImage = useWatch({ control, name: "main_image" });
  const watchedTag = useWatch({ control, name: "tag" });
  const watchedContent = useWatch({ control, name: "content" });

  // Memoize preview data to prevent unnecessary re-renders
  const memoizedPreviewData = useMemo(() => ({
    title: watchedTitle,
    main_image: watchedMainImage,
    tag: watchedTag,
    content: watchedContent
  }), [watchedTitle, watchedMainImage, watchedTag, watchedContent]);

  const onSubmit = async (values: NewsFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        main_image: values.main_image,
        category_id: Number(values.category_id),
        tag: values.tag || undefined,
        content: values.content,
        language: "vi",
      };

      if (initialData) {
        await newsService.update(initialData.id, payload as any);
      } else {
        await newsService.create(payload as any);
      }

      reset();
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Lưu không thành công");
    } finally {
      setLoading(false);
    }
  };

  // Memoized markdown to HTML conversion to prevent unnecessary processing
  const markdownToHtml = useCallback((markdown: string) => {
    if (!markdown) return "<p>Nội dung bài viết sẽ hiển thị ở đây...</p>";
    
    try {
      const html = marked(markdown) as string;
      
      return html
        .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4 text-gray-800">')
        .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-3 text-gray-800">')
        .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2 text-gray-800">')
        .replace(/<p>/g, '<p class="mb-3 text-gray-700 leading-relaxed">')
        .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-1">')
        .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-1">')
        .replace(/<li>/g, '<li class="text-gray-700">')
        .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-green-500 pl-4 italic my-4 text-gray-600">')
        .replace(/<a href/g, '<a class="text-blue-600 hover:underline" href')
        .replace(/<img/g, '<img class="max-w-full h-auto rounded-lg shadow-md my-4"')
        .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">')
        .replace(/<code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">');
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return `<p class="text-red-600">Lỗi hiển thị nội dung: ${error}</p>`;
    }
  }, []);

  // Memoized function to insert markdown at cursor position
  const insertMarkdownAtCursor = useCallback((markdown: string) => {
    const textarea = document.querySelector('textarea[name="content"]') || 
                    document.querySelector('.w-md-editor-text-textarea') ||
                    document.querySelector('.w-md-editor textarea');
    
    if (!textarea) {
      const currentValue = watch('content') || '';
      setValue('content', currentValue + '\n' + markdown);
      return;
    }
    
    const textareaElement = textarea as HTMLTextAreaElement;
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const currentValue = textareaElement.value;
    
    const newValue = currentValue.substring(0, start) + markdown + currentValue.substring(end);
    setValue('content', newValue);
    
    textareaElement.value = newValue;
    
    const event = new Event('input', { bubbles: true });
    textareaElement.dispatchEvent(event);
    
    setTimeout(() => {
      textareaElement.focus();
      textareaElement.setSelectionRange(start + markdown.length, start + markdown.length);
    }, 0);
  }, [setValue, watch]);

  // Memoized preview image to prevent reload on title/content changes
  const PreviewImage = useMemo(() => {
    if (!memoizedPreviewData.main_image) return null;
    
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={memoizedPreviewData.main_image}
          alt="Main article image"
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            const currentSrc = img.src;
            
            if (!currentSrc.includes('placeholder')) {
              img.src = "/placeholder.jpg";
            }
          }}
        />
      </div>
    );
  }, [memoizedPreviewData.main_image]);

  // Memoized content preview to prevent unnecessary markdown processing
  const PreviewContent = useMemo(() => {
    return (
      <div 
        className="prose max-w-none text-sm"
        dangerouslySetInnerHTML={{ 
          __html: markdownToHtml(memoizedPreviewData.content || "") 
        }}
      />
    );
  }, [memoizedPreviewData.content, markdownToHtml]);

  const PreviewCard = () => (
    <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 h-fit sticky top-4 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Eye className="h-5 w-5 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Xem trước bài viết</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Date Badge */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">
              {format(new Date(), "dd MMMM yyyy", { locale: vi })}
            </span>
            {memoizedPreviewData.tag && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                #{memoizedPreviewData.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">
            {memoizedPreviewData.title || "Tiêu đề bài viết"}
          </h1>

          {/* Main Image */}
          {PreviewImage}

          {/* Content Preview */}
          {PreviewContent}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form Section */}
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
                      <Newspaper className="h-5 w-5 text-green-600" />
                    </div>
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      Tiêu đề bài viết *
                    </label>
                    <Input 
                      {...register("title")} 
                      className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      placeholder="Nhập tiêu đề bài viết..."
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        Danh mục *
                      </label>
                      <Select 
                        defaultValue={initialData?.NewsCategory?.id ? String(initialData.NewsCategory.id) : ""} 
                        onValueChange={(value) => setValue("category_id", value)}
                      >
                        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {categories.length > 0 ? categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)} className="rounded-lg">
                              {cat.name}
                            </SelectItem>
                          )) : (
                            <SelectItem value="1" className="rounded-lg">
                              Tin tức chung
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.category_id && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.category_id.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-purple-600" />
                        Tag (tuỳ chọn)
                      </label>
                      <Input 
                        {...register("tag")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                        placeholder="Nhập tag..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Edit className="h-5 w-5 text-blue-600" />
                    </div>
                    Nội dung bài viết
                    <Badge variant="secondary" className="ml-auto">
                      Markdown
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div>
                    <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      Nội dung * 
                      <span className="text-xs text-gray-500 ml-2">
                        (Hỗ trợ Markdown: **bold**, *italic*, [link](url), ![image](url))
                      </span>
                    </label>
                    
                    <div className="border border-blue-200 rounded-xl overflow-hidden bg-white">
                      <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                          <MDEditor
                            value={field.value}
                            onChange={(value) => field.onChange(value || "")}
                            preview="edit"
                            height={400}
                            data-color-mode="light"
                            textareaProps={{
                              placeholder: "Nhập nội dung bài viết bằng Markdown...\n\n# Tiêu đề 1\n## Tiêu đề 2\n**Chữ đậm** và *chữ nghiêng*\n\n- Danh sách\n- Mục 2\n\n[Link](https://example.com)\n![Ảnh](https://example.com/image.jpg)",
                              style: {
                                fontSize: 14,
                                lineHeight: 1.6,
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Menlo, "Liberation Mono", "Consolas", monospace'
                              }
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Content Image Upload */}
                    <div className="mt-4">
                      <ContentImageUpload 
                        uploadedImages={uploadedContentImages}
                        onImagesUpdate={setUploadedContentImages}
                        onImageInsert={insertMarkdownAtCursor}
                      />
                    </div>
                    
                    {errors.content && (
                      <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.content.message}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/news")}
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
                      Cập nhật bài viết
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo bài viết
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

      {/* Preview Section */}
      <div className="hidden xl:block">
        <PreviewCard />
      </div>
    </div>
  );
} 