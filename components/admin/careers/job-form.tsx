"use client";

import { useState } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobService, JobArticle } from "@/lib/services";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  Eye, 
  Edit, 
  Save, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Users,
  Clock,
  Image as ImageIcon,
  FileText,
  Star,
  Gift,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  GripVertical,
  List
} from "lucide-react";

const jobSchema = z.object({
  job_title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự"),
  job_position: z.string().nonempty("Vị trí không được bỏ trống"),
  job_location: z.string().nonempty("Địa điểm không được bỏ trống"),
  job_deadline: z.string().nonempty(),
  status: z.enum(["draft", "published"]),
  primary_image: z.string().url({ message: "Ảnh chính phải là URL hợp lệ" }),
  job_description: z.array(z.object({
    item: z.string().min(1, "Nội dung không được trống")
  })).min(1, "Cần ít nhất 1 mô tả công việc"),
  job_requirements: z.array(z.object({
    item: z.string().min(1, "Nội dung không được trống")
  })).min(1, "Cần ít nhất 1 yêu cầu"),
  job_benefits: z.array(z.object({
    item: z.string().min(1, "Nội dung không được trống")
  })).min(1, "Cần ít nhất 1 phúc lợi"),
});

export type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  initialData?: JobArticle;
}

// Helper function to parse JSON or return array with single item
const parseJsonOrDefault = (value: string | undefined, defaultItem: string = "") => {
  if (!value) return [{ item: defaultItem }];
  
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({ item: typeof item === 'string' ? item : item.item || '' }));
    }
    return [{ item: value }];
  } catch {
    return [{ item: value }];
  }
};

export default function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
      ? {
          job_title: initialData.translations[0]?.job_title || "",
          job_position: initialData.translations[0]?.job_position || "",
          job_location: initialData.translations[0]?.job_location || "",
          job_deadline: initialData.job_deadline.split("T")[0],
          status: initialData.status,
          primary_image: initialData.primary_image,
          job_description: parseJsonOrDefault(initialData.translations[0]?.job_description),
          job_requirements: parseJsonOrDefault(initialData.translations[0]?.job_requirements),
          job_benefits: parseJsonOrDefault(initialData.translations[0]?.job_benefits),
        }
      : {
          job_title: "",
          job_position: "",
          job_location: "",
          job_deadline: format(new Date(), "yyyy-MM-dd"),
          status: "draft",
          primary_image: "",
          job_description: [{ item: "" }],
          job_requirements: [{ item: "" }],
          job_benefits: [{ item: "" }],
        },
  });

  // Field arrays for dynamic lists
  const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
    control,
    name: "job_description"
  });

  const { fields: reqFields, append: appendReq, remove: removeReq } = useFieldArray({
    control,
    name: "job_requirements"
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: "job_benefits"
  });

  // Watch form values for live preview
  const watchedValues = useWatch({ control });

  const onSubmit = async (values: JobFormValues) => {
    setLoading(true);
    try {
      // Convert arrays to JSON strings for API
      const payload = {
        ...values,
        job_deadline: new Date(values.job_deadline).toISOString(),
        language: "vi",
        job_description: JSON.stringify(values.job_description.map(item => item.item)),
        job_requirements: JSON.stringify(values.job_requirements.map(item => item.item)),
        job_benefits: JSON.stringify(values.job_benefits.map(item => item.item)),
      };

      if (initialData) {
        await jobService.update(initialData.id, payload as any);
      } else {
        await jobService.create(payload as any);
      }
      reset();
      router.push("/admin/careers");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Lưu không thành công");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic list component
  const DynamicList = ({ 
    title, 
    fields, 
    register, 
    append, 
    remove, 
    name, 
    icon: Icon, 
    color,
    placeholder 
  }: {
    title: string;
    fields: any[];
    register: any;
    append: (item: { item: string }) => void;
    remove: (index: number) => void;
    name: string;
    icon: any;
    color: string;
    placeholder: string;
  }) => (
    <div>
      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
        <Icon className={`h-4 w-4 text-${color}-600`} />
        {title}
      </label>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 group">
            <div className="flex items-center text-gray-400">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <Textarea
                {...register(`${name}.${index}.item` as const)}
                className={`border-${color}-200 focus:border-${color}-400 focus:ring-${color}-200 resize-none min-h-[60px] rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light`}
                placeholder={`${placeholder} ${index + 1}`}
                rows={2}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 self-start mt-1 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ item: "" })}
          className={`w-full border-${color}-300 text-${color}-700 hover:bg-${color}-50 hover:border-${color}-400 border-dashed rounded-xl transition-all duration-200 hover:shadow-md`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm {title.toLowerCase()}
        </Button>
      </div>
    </div>
  );

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
            {watchedValues.primary_image && (
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={watchedValues.primary_image} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {watchedValues.job_title || "Tiêu đề công việc"}
              </h2>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{watchedValues.job_position || "Vị trí"}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{watchedValues.job_location || "Địa điểm"}</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl border border-orange-200">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">
                    {watchedValues.job_deadline 
                      ? format(new Date(watchedValues.job_deadline), "dd/MM/yyyy", { locale: vi })
                      : "Chưa đặt hạn"
                    }
                  </span>
                </div>
              </div>

              <Badge 
                className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                  watchedValues.status === "published" 
                    ? "bg-green-100 text-green-800 border border-green-300" 
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {watchedValues.status === "published" ? "Đã công bố" : "Bản nháp"}
              </Badge>
            </div>
          </div>

          {/* Content Preview */}
          <div className="space-y-5">
            {/* Job Description Preview */}
            {watchedValues.job_description && watchedValues.job_description.some(item => item.item.trim()) && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  Mô tả công việc
                </h3>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
                  <ul className="space-y-2 text-sm text-gray-600">
                    {watchedValues.job_description
                      .filter(item => item.item.trim())
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item.item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Requirements Preview */}
            {watchedValues.job_requirements && watchedValues.job_requirements.some(item => item.item.trim()) && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  Yêu cầu ứng viên
                </h3>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm">
                  <ul className="space-y-2 text-sm text-gray-600">
                    {watchedValues.job_requirements
                      .filter(item => item.item.trim())
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item.item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Benefits Preview */}
            {watchedValues.job_benefits && watchedValues.job_benefits.some(item => item.item.trim()) && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Gift className="h-4 w-4 text-green-600" />
                  </div>
                  Quyền lợi & Phúc lợi
                </h3>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-200 shadow-sm">
                  <ul className="space-y-2 text-sm text-gray-600">
                    {watchedValues.job_benefits
                      .filter(item => item.item.trim())
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="leading-relaxed">{item.item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
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
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        Tiêu đề công việc *
                      </label>
                      <Input 
                        {...register("job_title")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                        placeholder="Nhập tiêu đề công việc..."
                      />
                      {errors.job_title && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.job_title.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        Vị trí công việc *
                      </label>
                      <Input 
                        {...register("job_position")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                        placeholder="Nhập vị trí công việc..."
                      />
                      {errors.job_position && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.job_position.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        Địa điểm làm việc *
                      </label>
                      <Input 
                        {...register("job_location")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                        placeholder="Nhập địa điểm làm việc..."
                      />
                      {errors.job_location && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.job_location.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                        Hạn nộp hồ sơ
                      </label>
                      <Input 
                        type="date" 
                        {...register("job_deadline")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                        Trạng thái
                      </label>
                      <Select defaultValue={initialData ? initialData.status : "draft"} {...register("status") as any}>
                        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="draft" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              Bản nháp
                            </div>
                          </SelectItem>
                          <SelectItem value="published" className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              Đã công bố
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-pink-600" />
                        Ảnh đại diện (URL)
                      </label>
                      <Input 
                        {...register("primary_image")} 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                        placeholder="Nhập đường dẫn ảnh..."
                      />
                      {errors.primary_image && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.primary_image.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <List className="h-5 w-5 text-blue-600" />
                    </div>
                    Nội dung chi tiết
                    <Badge variant="secondary" className="ml-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">JSON Format</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Job Description */}
                  <DynamicList
                    title="Mô tả công việc"
                    fields={descFields}
                    register={register}
                    append={appendDesc}
                    remove={removeDesc}
                    name="job_description"
                    icon={FileText}
                    color="blue"
                    placeholder="Nhập mô tả công việc..."
                  />
                  {errors.job_description && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.job_description.message}</span>
                    </div>
                  )}

                  {/* Job Requirements */}
                  <DynamicList
                    title="Yêu cầu ứng viên"
                    fields={reqFields}
                    register={register}
                    append={appendReq}
                    remove={removeReq}
                    name="job_requirements"
                    icon={Star}
                    color="purple"
                    placeholder="Nhập yêu cầu ứng viên..."
                  />
                  {errors.job_requirements && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.job_requirements.message}</span>
                    </div>
                  )}

                  {/* Job Benefits */}
                  <DynamicList
                    title="Quyền lợi & Phúc lợi"
                    fields={benefitFields}
                    register={register}
                    append={appendBenefit}
                    remove={removeBenefit}
                    name="job_benefits"
                    icon={Gift}
                    color="green"
                    placeholder="Nhập quyền lợi & phúc lợi..."
                  />
                  {errors.job_benefits && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errors.job_benefits.message}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/careers")}
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-gradient-to-r from-[#00b764] to-green-600 hover:from-[#00a055] hover:to-green-700 shadow-lg px-10 py-3 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang lưu...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {initialData ? "Cập nhật" : "Tạo mới"}
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

      {/* Preview Section - Takes 1/3 width on xl screens, hidden on smaller screens */}
      <div className="hidden xl:block">
        <PreviewCard />
      </div>
    </div>
  );
} 