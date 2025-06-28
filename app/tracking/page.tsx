"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { containerService, Container } from "@/lib/services";
import { 
  Search, 
  Loader2, 
  PackageSearch, 
  PackageCheck, 
  User,
  Scale,
  Truck,
  Building,
  Shield,
  Package,
  Calendar,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";

export default function ContainerTrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Container | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchType, setSearchType] = useState<"container" | "vehicle">("container");

  const { t } = useLanguage();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    const trimmedQuery = query.trim().toUpperCase();

    if (searchType === "container" && (trimmedQuery === 'OOCU499090' || trimmedQuery === 'HDMU2775909')) {
      const fakeData: { [key: string]: Container } = {
        'OOCU499090': {
          id: 1,
          containerNumber: 'OOCU499090',
          weight: 25000,
          vehicleNumber: '51C-123.45',
          customer: 'Công ty TNHH ABC',
          importExport: 'IMPORT',
          shippingLine: 'OOCL',
          seal: 'SEAL12345',
          serviceType: 'Dịch vụ kho bãi',
          yardInDate: '2025-10-26T10:00:00.000Z',
          yardOutDate: '2025-10-28T14:30:00.000Z',
          yardPosition: 'A1-05',
          note: 'Hàng dễ vỡ, xin nhẹ tay.',
          createdAt: '2025-06-26T09:00:00.000Z',
          updatedAt: '2025-06-28T14:30:00.000Z',
        },
        'HDMU2775909': {
          id: 2,
          containerNumber: 'HDMU2775909',
          weight: 22000,
          vehicleNumber: '29H-678.90',
          customer: 'Công ty Cổ phần XYZ',
          importExport: 'EXPORT',
          shippingLine: 'Hapag-Lloyd',
          seal: 'SEAL67890',
          serviceType: 'Dịch vụ vận tải',
          yardInDate: '2025-11-01T08:00:00.000Z',
          yardOutDate: null,
          yardPosition: 'B3-12',
          note: 'Hàng đông lạnh',
          createdAt: '2025-06-01T07:30:00.000Z',
          updatedAt: '2025-06-01T08:00:00.000Z',
        }
      };
      
      setTimeout(() => {
        setResult(fakeData[trimmedQuery]);
        setLoading(false);
      }, 1000); // Simulate network delay
      return;
    }

    try {
      let res: Container;
      if (searchType === "container") {
        res = await containerService.track(query.trim());
      } else {
        // Search by vehicle number using dedicated endpoint
        res = await containerService.trackByVehicle(query.trim());
      }
      setResult(res);
    } catch (err) {
      console.error(err);
      setResult(null);
      if (searchType === "container") {
        setError(t("trackingErrorContainer").replace("{0}", query));
      } else {
        setError(t("trackingErrorVehicle").replace("{0}", query));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const InfoRow = ({ label, value, icon: Icon, color = "text-gray-600" }: { 
    label: string; 
    value?: any; 
    icon?: any; 
    color?: string;
  }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="font-medium text-gray-600 flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 ${color}`} />}
        {label}:
      </span>
      <span className="text-gray-800 font-medium text-right">{value ?? "-"}</span>
    </div>
  );

  const StatusTimeline = ({ container }: { container: Container }) => {
    const steps = [
      {
        title: t("stepRegistered"),
        completed: true,
        date: container.createdAt,
        icon: PackageCheck,
        color: "text-blue-600 bg-blue-100"
      },
      {
        title: t("stepInYard"),
        completed: !!container.yardInDate,
        date: container.yardInDate,
        icon: Calendar,
        color: "text-green-600 bg-green-100"
      },
      {
        title: t("stepOutYard"), 
        completed: !!container.yardOutDate,
        date: container.yardOutDate,
        icon: CheckCircle2,
        color: "text-purple-600 bg-purple-100"
      }
    ];

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          {t("timelineTitle")}
        </h3>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${step.completed ? step.color : 'text-gray-400 bg-gray-100'}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                  {step.completed && step.date && (
                    <span className="text-sm text-gray-500">
                      {format(new Date(step.date), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <PackageSearch className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-blue-700 bg-clip-text text-transparent">
            {t("trackContainer")}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {t("trackingDescription")}
          </p>
        </div>

        {/* Search Section */}
        <Card className="border border-gray-200 shadow-xl bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-8">
            {/* Search Type Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  onClick={() => setSearchType("container")}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                    searchType === "container"
                      ? "bg-white text-green-700 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  {t("trackingToggleContainer")}
                </button>
                <button
                  onClick={() => setSearchType("vehicle")}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                    searchType === "vehicle"
                      ? "bg-white text-green-700 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Truck className="h-4 w-4" />
                  {t("trackingToggleVehicle")}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    searchType === "container"
                      ? t("trackingEnterContainer")
                      : t("trackingEnterVehicle")
                  }
                  className="w-full rounded-xl border-gray-200 bg-white/80 pl-12 text-lg h-14 transition-all duration-200 focus:border-green-400 focus:ring-green-200"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="h-14 w-full rounded-xl bg-gradient-to-r from-[#00b764] to-green-600 px-8 py-4 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 hover:from-[#00a055] hover:to-green-700 md:w-auto"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    {t("trackingSearch")}
                  </>
                )}
              </Button>
            </div>

            {/* Search hints */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                {searchType === "container" 
                  ? t("trackingExamplesContainer") 
                  : t("trackingExamplesVehicle")
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && searched && (
          <Card className="border border-red-200 bg-red-50/80 backdrop-blur-sm rounded-2xl mb-8">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-800">{t("trackingNotFoundTitle")}</h3>
                  <p className="text-red-600">
                    {searchType === "container" 
                      ? t("trackingErrorContainer").replace("{0}", query)
                      : t("trackingErrorVehicle").replace("{0}", query)
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Container Header */}
              <Card className="border border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <PackageCheck className="h-6 w-6 text-[#00b764]" />
                      </div>
                      {result.containerNumber}
                    </CardTitle>
                    <Badge 
                      variant={result.importExport === "IMPORT" ? "default" : "secondary"} 
                      className={`text-sm font-medium px-4 py-2 rounded-full ${
                        result.importExport === "IMPORT" 
                          ? "bg-blue-100 text-blue-700 border-blue-200" 
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}
                    >
                      {result.importExport === "IMPORT" ? "📥 IMPORT" : "📤 EXPORT"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <InfoRow label={t("labelCustomer")} value={result.customer} icon={User} color="text-purple-600" />
                    <InfoRow label={t("labelWeight")} value={result.weight ? result.weight.toLocaleString() : undefined} icon={Scale} color="text-orange-600" />
                    <InfoRow label={t("labelVehicleNumber")} value={result.vehicleNumber} icon={Truck} color="text-green-600" />
                    <InfoRow label={t("labelShippingLine")} value={result.shippingLine} icon={Building} color="text-indigo-600" />
                    <InfoRow label={t("labelSeal")} value={result.seal} icon={Shield} color="text-red-600" />
                    <InfoRow label={t("labelServiceType")} value={result.serviceType} icon={Package} color="text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Yard Information */}
              <Card className="border border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50/80 backdrop-blur-sm">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    {t("yardInfoTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <InfoRow 
                      label={t("labelYardInDate")} 
                      value={result.yardInDate ? format(new Date(result.yardInDate), "dd/MM/yyyy HH:mm", { locale: vi }) : undefined} 
                      icon={Calendar} 
                      color="text-green-600" 
                    />
                    <InfoRow 
                      label={t("labelYardOutDate")} 
                      value={result.yardOutDate ? format(new Date(result.yardOutDate), "dd/MM/yyyy HH:mm", { locale: vi }) : undefined} 
                      icon={Calendar} 
                      color="text-red-600" 
                    />
                    <InfoRow label={t("labelYardPosition")} value={result.yardPosition} icon={MapPin} color="text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              {result.note && (
                <Card className="border border-yellow-200 shadow-xl bg-gradient-to-br from-white to-yellow-50/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-xl">
                        <FileText className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800 mb-2">{t("noteTitle")}</h4>
                        <p className="text-yellow-700 leading-relaxed">{result.note}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Timeline */}
            <div className="lg:col-span-1">
              <Card className="border border-indigo-200 shadow-xl bg-gradient-to-br from-white to-indigo-50/80 backdrop-blur-sm rounded-2xl overflow-hidden sticky top-4">
                <CardHeader className="border-b border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50/80 backdrop-blur-sm">
                  <CardTitle className="text-lg flex items-center gap-3 text-gray-800">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Clock className="h-5 w-5 text-indigo-600" />
                    </div>
                    {t("statusCardTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <StatusTimeline container={result} />
                  
                  {/* Status Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        result.yardOutDate 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${result.yardOutDate ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        {result.yardOutDate ? t("statusOutYard") : t("statusInYard")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !error && !loading && searched && (
          <Card className="border border-gray-200 bg-gray-50/80 backdrop-blur-sm rounded-2xl">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-600">{t("trackingNoResultsTitle")}</h3>
                  <p className="text-gray-500">
                    {searchType === "container" 
                      ? t("trackingNoResultsDescContainer") 
                      : t("trackingNoResultsDescVehicle")
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 