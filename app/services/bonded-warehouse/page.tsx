"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Warehouse, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BondedWarehousePage() {
  const { t } = useLanguage()

  // Features specific to this service
  const features = [
    "bondedStorage", 
    "inspectionServices", 
    "securityMonitoring", 
    "temperatureControl", 
    "customsCompliance"
  ]

  // Process steps
  const processSteps = [
    {
      step: 1,
      titleKey: "receiveRequest",
      descriptionKey: "receiveRequestDesc",
    },
    {
      step: 2,
      titleKey: "consultationQuote",
      descriptionKey: "consultationQuoteDesc",
    },
    {
      step: 3,
      titleKey: "contractSigning",
      descriptionKey: "contractSigningDesc",
    },
    {
      step: 4,
      titleKey: "serviceExecution",
      descriptionKey: "serviceExecutionDesc",
    },
    {
      step: 5,
      titleKey: "completionHandover",
      descriptionKey: "completionHandoverDesc",
    },
  ]

  // Benefits items for bonded warehouse
  const warehouseBenefitItems = [
    {
      titleKey: "taxSavingTitle",
      descriptionKey: "taxSavingDesc"
    },
    {
      titleKey: "warehouseSafetyTitle",
      descriptionKey: "warehouseSafetyDesc"
    },
    {
      titleKey: "processingFlexibilityTitle",
      descriptionKey: "processingFlexibilityDesc"
    },
    {
      titleKey: "modernSystemTitle",
      descriptionKey: "modernSystemDesc"
    },
    {
      titleKey: "valueAddedServicesTitle",
      descriptionKey: "valueAddedServicesDesc"
    },
    {
      titleKey: "strategicLocationTitle",
      descriptionKey: "strategicLocationDesc"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Service Hero */}
      <section className="py-20 bg-gradient-to-r from-[#00b764]/10 to-[#1a3b2f]/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link href="/" className="hover:text-[#00b764]">{t("home")}</Link>
                <span>&gt;</span>
                <Link href="/services" className="hover:text-[#00b764]">{t("services")}</Link>
                <span>&gt;</span>
                <span className="text-[#00b764]">{t("bondedWarehouseService")}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a3b2f] mb-6">{t("bondedWarehouseService")}</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t("bondedInspectionDesc")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-[#00b764] text-white px-4 py-2">15+ {t("experienceYears")}</Badge>
                <Badge className="bg-[#1a3b2f] text-white px-4 py-2">ISO 9001:2015</Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2">24/7 {t("service247")}</Badge>
              </div>
            </div>

            {/* Quick Quote Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1a3b2f]">{t("quickQuote")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={`${t("fullName")} *`} className="rounded-xl border-gray-200" />
                  <Input placeholder={`${t("phoneNumber")} *`} className="rounded-xl border-gray-200" />
                </div>
                <Input placeholder={`${t("email")} *`} className="rounded-xl border-gray-200" />
                <Select defaultValue="warehouse">
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder={t("serviceInterest")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistics">{t("logisticsSupportService")}</SelectItem>
                    <SelectItem value="customs">{t("customsClearanceService")}</SelectItem>
                    <SelectItem value="warehouse">{t("bondedWarehouseService")}</SelectItem>
                    <SelectItem value="freight">{t("freightForwardingService")}</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder={t("detailDescription")} rows={3} className="rounded-xl border-gray-200" />
                <Button className="w-full bg-[#00b764] hover:bg-[#00b764]/90 text-white rounded-xl">{t("sendRequest")}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Detail */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
              <img 
                src="/img/service2.png" 
                alt={t("bondedWarehouseService")} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-[#e8f5ee] rounded-lg flex items-center justify-center mr-4">
                  <Warehouse className="h-8 w-8 text-[#00b764]" />
                </div>
                <h2 className="text-3xl font-bold text-[#1a3b2f]">{t("bondedWarehouseService")}</h2>
              </div>

              <div className="text-lg text-gray-600 space-y-4 mb-8">
                <p>{t("bondedInspectionDesc")}</p>
                <p>
                  Chi Ma HTT cung cấp dịch vụ kho ngoại quan và kho kiểm hóa hiện đại với diện tích lớn, 
                  được trang bị các thiết bị tiên tiến, đáp ứng mọi nhu cầu lưu trữ, bảo quản hàng hóa.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-xl text-[#1a3b2f] mb-4">{t("keyFeatures")}</h3>
                <ul className="space-y-3 grid md:grid-cols-2 md:gap-x-4 md:gap-y-3 md:space-y-0">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#00b764] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{t(feature as any)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/contact">
                <Button className="bg-[#00b764] hover:bg-[#00b764]/90 text-white w-fit group">
                  {t("consultAdvice")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">
              {t("warehouseBenefitsTitle")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("warehouseBenefitsDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {warehouseBenefitItems.map((benefit, index) => (
              <Card key={index} className="shadow-lg border-none">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 bg-[#e8f5ee] rounded-lg flex items-center justify-center mb-6">
                    <span className="text-xl font-bold text-[#00b764]">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3b2f] mb-3">{t(benefit.titleKey as any)}</h3>
                  <p className="text-gray-600">{t(benefit.descriptionKey as any)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("workflowProcess")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("workflowDesc")}</p>
          </div>

          <div className="relative">
            {/* Desktop Process Flow */}
            <div className="hidden lg:block">
              <div className="flex justify-between items-center mb-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#00b764] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 relative z-10">
                        {step.step}
                      </div>
                      <h3 className="font-bold text-[#1a3b2f] mb-2 text-center">{t(step.titleKey as any)}</h3>
                      <p className="text-gray-600 text-sm text-center max-w-xs">{t(step.descriptionKey as any)}</p>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#00b764] transform translate-x-8 z-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Process Flow */}
            <div className="lg:hidden space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-[#00b764] rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a3b2f] mb-1">{t(step.titleKey as any)}</h3>
                    <p className="text-gray-600 text-sm">{t(step.descriptionKey as any)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00b764] to-[#1a3b2f] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("readyToStart")}</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">{t("readyToStartDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-[#00b764] hover:bg-white/90 px-8 py-3">
                {t("contactNow")}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#00b764] px-8 py-3"
            >
              {t("downloadBrochure")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 