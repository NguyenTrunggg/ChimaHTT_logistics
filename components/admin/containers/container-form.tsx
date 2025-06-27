"use client";

import { Container } from "@/lib/types/container";
import { containerService } from "@/lib/services";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Save, 
  Plus, 
  Edit,
  Eye,
  Package,
  Truck,
  User,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  Building,
  Scale,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const schema = z.object({
  containerNumber: z.string().min(4, { message: "Số container tối thiểu 4 ký tự" }),
  customer: z.string().optional(),
  importExport: z.enum(["IMPORT", "EXPORT"]),
  weight: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
  vehicleNumber: z.string().optional(),
  shippingLine: z.string().optional(),
  seal: z.string().optional(),
  serviceType: z.string().optional(),
  yardInDate: z.string().optional(),
  yardOutDate: z.string().optional(),
  yardPosition: z.string().optional(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initialData?: Container;
}

export default function ContainerForm({ initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          containerNumber: initialData.containerNumber,
          customer: initialData.customer ?? "",
          importExport: initialData.importExport,
          weight: initialData.weight,
          vehicleNumber: initialData.vehicleNumber ?? "",
          shippingLine: initialData.shippingLine ?? "",
          seal: initialData.seal ?? "",
          serviceType: initialData.serviceType ?? "",
          yardInDate: initialData.yardInDate?.split("T")[0] ?? "",
          yardOutDate: initialData.yardOutDate?.split("T")[0] ?? "",
          yardPosition: initialData.yardPosition ?? "",
          note: initialData.note ?? "",
        }
      : {
          containerNumber: "",
          customer: "",
          importExport: "IMPORT",
          weight: undefined,
          vehicleNumber: "",
          shippingLine: "",
          seal: "",
          serviceType: "",
          yardInDate: "",
          yardOutDate: "",
          yardPosition: "",
          note: "",
        },
  });

  // Watch form values for live preview
  const watchedValues = useWatch({ control });

  // Memoize preview data to prevent unnecessary re-renders
  const memoizedPreviewData = useMemo(() => ({
    containerNumber: watchedValues.containerNumber,
    customer: watchedValues.customer,
    importExport: watchedValues.importExport,
    weight: watchedValues.weight,
    vehicleNumber: watchedValues.vehicleNumber,
    shippingLine: watchedValues.shippingLine,
    seal: watchedValues.seal,
    serviceType: watchedValues.serviceType,
    yardInDate: watchedValues.yardInDate,
    yardOutDate: watchedValues.yardOutDate,
    yardPosition: watchedValues.yardPosition,
    note: watchedValues.note,
  }), [watchedValues]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    // Transform to backend snake_case
    const payload = {
      container_number: data.containerNumber,
      customer: data.customer,
      import_export: data.importExport,
      weight: data.weight,
      vehicle_number: data.vehicleNumber,
      shipping_line: data.shippingLine,
      seal: data.seal,
      service_type: data.serviceType,
      yard_in_date: data.yardInDate ? new Date(data.yardInDate).toISOString() : undefined,
      yard_out_date: data.yardOutDate ? new Date(data.yardOutDate).toISOString() : undefined,
      yard_position: data.yardPosition,
      note: data.note,
    } as any;

    try {
      if (initialData) {
        await containerService.update(initialData.id, payload);
      } else {
        await containerService.create(payload);
      }
      router.push("/admin/containers");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Lưu không thành công");
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: any; icon?: any }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-600 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}:
      </span>
      <span className="text-gray-800 font-medium">{value ?? "-"}</span>
    </div>
  );

  const PreviewCard = () => (
    <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 h-fit sticky top-4 rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Eye className="h-5 w-5 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Xem trước Container</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Container Header */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {memoizedPreviewData.containerNumber || "Số Container"}
            </h2>
            <Badge variant={memoizedPreviewData.importExport === "IMPORT" ? "default" : "secondary"} className="text-sm">
              {memoizedPreviewData.importExport || "IMPORT"}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="space-y-2">
            <InfoRow label="Khách hàng" value={memoizedPreviewData.customer} icon={User} />
            <InfoRow label="Trọng tải (kg)" value={memoizedPreviewData.weight} icon={Scale} />
            <InfoRow label="Số xe" value={memoizedPreviewData.vehicleNumber} icon={Truck} />
            <InfoRow label="Loại hãng" value={memoizedPreviewData.shippingLine} icon={Building} />
            <InfoRow label="Seal" value={memoizedPreviewData.seal} icon={Shield} />
            <InfoRow label="Loại dịch vụ" value={memoizedPreviewData.serviceType} icon={Package} />
            <InfoRow 
              label="Ngày vào bãi" 
              value={memoizedPreviewData.yardInDate ? format(new Date(memoizedPreviewData.yardInDate), "dd/MM/yyyy", { locale: vi }) : undefined} 
              icon={Calendar} 
            />
            <InfoRow 
              label="Ngày ra bãi" 
              value={memoizedPreviewData.yardOutDate ? format(new Date(memoizedPreviewData.yardOutDate), "dd/MM/yyyy", { locale: vi }) : undefined} 
              icon={Calendar} 
            />
            <InfoRow label="Vị trí bãi" value={memoizedPreviewData.yardPosition} icon={MapPin} />
          </div>

          {/* Note */}
          {memoizedPreviewData.note && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Ghi chú</h4>
                  <p className="text-sm text-yellow-700">{memoizedPreviewData.note}</p>
                </div>
              </div>
            </div>
          )}
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
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    Thông tin Container
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        Số Container *
                      </label>
                      <Input 
                        {...register("containerNumber")} 
                        placeholder="VD: ABCU1234567" 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                      {errors.containerNumber && (
                        <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.containerNumber.message}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        Khách hàng
                      </label>
                      <Input 
                        {...register("customer")} 
                        placeholder="Tên khách hàng..."
                        className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        Nhập / Xuất *
                      </label>
                      <Select 
                        defaultValue={initialData?.importExport ?? "IMPORT"}
                        onValueChange={(v) => setValue("importExport", v as "IMPORT" | "EXPORT")}
                      >
                        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="IMPORT" className="rounded-lg">📥 IMPORT</SelectItem>
                          <SelectItem value="EXPORT" className="rounded-lg">📤 EXPORT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logistics Information */}
              <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    Thông tin Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-orange-600" />
                        Trọng tải (kg)
                      </label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...register("weight")} 
                        placeholder="VD: 25000"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-600" />
                        Số xe
                      </label>
                      <Input 
                        {...register("vehicleNumber")} 
                        placeholder="VD: 29A-12345"
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Building className="h-4 w-4 text-indigo-600" />
                        Loại hãng
                      </label>
                      <Input 
                        {...register("shippingLine")} 
                        placeholder="VD: Maersk, COSCO..."
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        Seal
                      </label>
                      <Input 
                        {...register("seal")} 
                        placeholder="Số seal container..."
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Package className="h-4 w-4 text-purple-600" />
                        Loại dịch vụ
                      </label>
                      <Input 
                        {...register("serviceType")} 
                        placeholder="VD: FCL, LCL..."
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Yard Information */}
              <Card className="border border-purple-200 shadow-xl bg-gradient-to-br from-white to-purple-50 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    Thông tin Bãi container
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        Ngày vào bãi
                      </label>
                      <Input 
                        type="date" 
                        {...register("yardInDate")} 
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-600" />
                        Ngày ra bãi
                      </label>
                      <Input 
                        type="date" 
                        {...register("yardOutDate")} 
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Vị trí bãi
                      </label>
                      <Input 
                        {...register("yardPosition")} 
                        placeholder="VD: A1-15, B2-03..."
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        Ghi chú
                      </label>
                      <Textarea 
                        rows={4} 
                        {...register("note")} 
                        placeholder="Ghi chú thêm về container..."
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/containers")}
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang lưu...
                    </div>
                  ) : initialData ? (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Cập nhật Container
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo Container
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