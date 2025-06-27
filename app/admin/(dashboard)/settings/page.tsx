"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { ADMIN_PERMISSIONS } from "@/lib/services/permission.service";
import { systemConfigService } from "@/lib/services/config.service";
import { toast } from "sonner";
import { 
  Settings, 
  Save, 
  Key, 
  Brain, 
  Newspaper, 
  Briefcase, 
  Wrench,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles
} from "lucide-react";

interface ApiKeyConfig {
  key: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showKeys, setShowKeys] = useState({
    GEMINI_API_KEY_NEWS: false,
    GEMINI_API_KEY_JOB: false,
    GEMINI_API_KEY_SERVICE: false,
  });
  const [apiKeys, setApiKeys] = useState({
    GEMINI_API_KEY_NEWS: "",
    GEMINI_API_KEY_JOB: "",
    GEMINI_API_KEY_SERVICE: "",
  });
  const [testResults, setTestResults] = useState<{[key: string]: boolean | null}>({});
  const [usageStats, setUsageStats] = useState({
    apiCallsToday: 0,
    tokensUsed: 0,
    tokensLimit: 100000,
    costThisMonth: 0,
    budget: 100,
  });

  const apiConfigs: ApiKeyConfig[] = [
    {
      key: "GEMINI_API_KEY_NEWS",
      name: "Gemini API - Tin tức",
      description: "API key để tự động tạo và dịch nội dung tin tức",
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      key: "GEMINI_API_KEY_JOB",
      name: "Gemini API - Tuyển dụng",
      description: "API key để tạo mô tả công việc và yêu cầu tuyển dụng",
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      key: "GEMINI_API_KEY_SERVICE",
      name: "Gemini API - Dịch vụ",
      description: "API key để tự động dịch và tối ưu nội dung dịch vụ",
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  useEffect(() => {
    // Load existing API keys and usage stats from backend
    const loadData = async () => {
      try {
        setPageLoading(true);
        
        // Load API keys
        const keys = await systemConfigService.getApiKeys();
        setApiKeys(keys);
        
        // Load usage statistics
        const stats = await systemConfigService.getUsageStats();
        setUsageStats(stats);
        
      } catch (error) {
        console.error("Failed to load settings data:", error);
        toast.error("Không thể tải dữ liệu cấu hình");
      } finally {
        setPageLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleKeyVisibility = (keyName: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName as keyof typeof prev]
    }));
  };

  const testApiKey = async (keyName: string) => {
    if (!apiKeys[keyName as keyof typeof apiKeys]) {
      toast.error("Vui lòng nhập API key trước khi test");
      return;
    }
    
    setTestResults(prev => ({ ...prev, [keyName]: null }));
    
    try {
      const apiKeyValue = apiKeys[keyName as keyof typeof apiKeys];
      
      // Validate format first
      if (!apiKeyValue.startsWith("AIza") || apiKeyValue.length < 35) {
        setTestResults(prev => ({ ...prev, [keyName]: false }));
        toast.error("Format API key không đúng. API key phải bắt đầu bằng 'AIza' và có ít nhất 35 ký tự");
        return;
      }
      
      const isValid = await systemConfigService.testApiKey(keyName, apiKeyValue);
      setTestResults(prev => ({ ...prev, [keyName]: isValid }));
      
      if (isValid) {
        toast.success(`✅ API key ${keyName.replace('GEMINI_API_KEY_', '')} hoạt động bình thường!`);
      } else {
        toast.error(`❌ API key ${keyName.replace('GEMINI_API_KEY_', '')} không hợp lệ hoặc đã bị vô hiệu hóa`);
      }
    } catch (error: any) {
      console.error(`Failed to test API key ${keyName}:`, error);
      setTestResults(prev => ({ ...prev, [keyName]: false }));
      
      if (error.message?.includes('Invalid API key format')) {
        toast.error("Format API key không đúng");
      } else if (error.message?.includes('403')) {
        toast.error("API key không có quyền truy cập hoặc đã bị khóa");
      } else if (error.message?.includes('400')) {
        toast.error("API key không hợp lệ");
      } else {
        toast.error("Không thể kết nối đến Google Gemini API. Vui lòng thử lại sau");
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Filter out empty API keys
      const keysToUpdate = Object.entries(apiKeys)
        .filter(([_, value]) => value.trim() !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      if (Object.keys(keysToUpdate).length === 0) {
        toast.error("Vui lòng nhập ít nhất một API key");
        return;
      }
      
      await systemConfigService.updateApiKeys(keysToUpdate);
      toast.success("Cấu hình đã được lưu thành công!");
      
      // Clear test results after successful save
      setTestResults({});
      
    } catch (error) {
      console.error("Failed to save API keys:", error);
      toast.error("Có lỗi xảy ra khi lưu cấu hình!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <PermissionGuard permission={ADMIN_PERMISSIONS.SETTINGS_VIEW}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                    Đang tải cấu hình...
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission={ADMIN_PERMISSIONS.SETTINGS_VIEW}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
                  Cấu hình Hệ thống
                </h1>
                <p className="text-gray-600 mt-1">
                  Quản lý API keys và cài đặt tích hợp AI
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-medium">AI Configuration</span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Configuration */}
        <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              Cấu hình Gemini AI API Keys
              <Badge variant="secondary" className="ml-auto">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {apiConfigs.map((config, index) => (
                <div key={config.key} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 ${config.bgColor} rounded-2xl`}>
                      <config.icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{config.name}</h3>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="block font-semibold text-gray-700 flex items-center gap-2">
                      <div className={`w-3 h-3 ${config.color.replace('text-', 'bg-')} rounded-full`}></div>
                      API Key *
                    </Label>
                    
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showKeys[config.key as keyof typeof showKeys] ? "text" : "password"}
                          value={apiKeys[config.key as keyof typeof apiKeys]}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, [config.key]: e.target.value }))}
                          placeholder="Nhập Gemini API Key..."
                          className="pl-10 pr-12 border-green-200 focus:border-green-400 focus:ring-green-200 h-12 rounded-xl transition-all duration-200 hover:shadow-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(config.key)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          {showKeys[config.key as keyof typeof showKeys] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => testApiKey(config.key)}
                        disabled={!apiKeys[config.key as keyof typeof apiKeys] || testResults[config.key] === null}
                        className="px-4 h-12 rounded-xl border-green-200 hover:border-green-400 transition-all duration-200"
                      >
                        {testResults[config.key] === null ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : testResults[config.key] === true ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : testResults[config.key] === false ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                    </div>

                    {/* Status indicator */}
                    {testResults[config.key] !== undefined && (
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
                        testResults[config.key] 
                          ? 'text-green-600 bg-green-50 border-green-200'
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}>
                        {testResults[config.key] ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {testResults[config.key] 
                            ? 'API Key hợp lệ và hoạt động bình thường'
                            : 'API Key không hợp lệ hoặc đã hết hạn'
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {index < apiConfigs.length - 1 && (
                    <div className="border-t border-green-100 pt-6 mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        {/* <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
            <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              Thống kê sử dụng API
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">API Calls hôm nay</span>
                  <Newspaper className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {pageLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : usageStats.apiCallsToday.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  {pageLoading ? "Đang tải..." : "+12% so với hôm qua"}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tokens sử dụng</span>
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {pageLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${(usageStats.tokensUsed / 1000).toFixed(1)}K`}
                </div>
                <div className="text-xs text-purple-600">
                  {pageLoading ? "Đang tải..." : `Còn lại: ${((usageStats.tokensLimit - usageStats.tokensUsed) / 1000).toFixed(1)}K`}
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Chi phí tháng này</span>
                  <Sparkles className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {pageLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${usageStats.costThisMonth.toFixed(2)}`}
                </div>
                <div className="text-xs text-orange-600">
                  {pageLoading ? "Đang tải..." : `Budget: $${usageStats.budget}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-green-200">
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            Hủy thay đổi
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-[#00b764] to-green-600 hover:from-[#00a055] hover:to-green-700 text-white px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Lưu cấu hình
              </div>
            )}
          </Button>
        </div>
      </div>
    </PermissionGuard>
  );
}
