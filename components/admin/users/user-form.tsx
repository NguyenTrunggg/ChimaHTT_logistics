import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save, Plus, Loader2, User, Mail, Lock, Shield, Users } from "lucide-react";
import { userService, roleService, UserProfile, Role } from "@/lib/services";

const userSchema = z.object({
  username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự").optional(),
  roleId: z.string({ required_error: "Vui lòng chọn vai trò" }),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserProfile;
}

export default function UserForm({ initialData }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          username: initialData.username,
          email: initialData.email ?? "",
          password: "",
          roleId: String((initialData.role as any)?.id ?? ""),
        }
      : {
          username: "",
          email: "",
          password: "",
          roleId: "",
        },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.list();
        const arr = Array.isArray((data as any)?.data) ? (data as any).data : (Array.isArray(data) ? data : []);
        setRoles(arr);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchRoles();
  }, []);

  const onSubmit = async (values: UserFormValues) => {
    setLoading(true);
    try {
      const payload: any = {
        username: values.username,
        email: values.email || undefined,
        role_id: Number(values.roleId),
      };

      if (values.password) {
        // Send plain password to backend - let backend handle hashing
        payload.password = values.password;
      }

      if (initialData) {
        await userService.update(initialData.id as number, payload);
      } else {
        await userService.create(payload);
      }

      window.history.back();
    } catch (err) {
      console.error(err);
      alert("Lưu không thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Card */}
      <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <User className="h-5 w-5 text-green-600" />
            </div>
            Thông tin tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Username */}
          <div>
            <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              Tên người dùng *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                {...register("username")}
                className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                placeholder="Nhập tên người dùng..."
              />
            </div>
            {errors.username && (
              <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.username.message}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                {...register("email")}
                type="email"
                className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                placeholder="Nhập địa chỉ email..."
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.email.message}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              Mật khẩu {initialData ? "(Để trống nếu không đổi)" : "*"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="password" 
                {...register("password")}
                className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md placeholder:text-gray-400 placeholder:italic placeholder:font-light"
                placeholder={initialData ? "Nhập mật khẩu mới..." : "Nhập mật khẩu..."}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.password.message}</span>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block font-semibold mb-3 text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              Vai trò *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Select
                value={watch("roleId")}
                onValueChange={(val) => setValue("roleId", val, { shouldValidate: true })}
              >
                <SelectTrigger className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md">
                  <SelectValue placeholder="Chọn vai trò người dùng..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.roleId && (
              <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.roleId.message}</span>
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
          onClick={() => window.history.back()}
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
              Cập nhật người dùng
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tạo người dùng
            </div>
          )}
        </Button>
      </div>
    </form>
  );
} 