"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Truck, Warehouse, Ship, FileText, Package, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Users,
      titleKey: "passengerTransitCenter",
      descriptionKey: "passengerTransitDesc",
      features: ["vipLounge", "dining247", "immigrationSupport", "airportShuttle", "translationService"],
      image: "/img/service1.png",
    },
    {
      icon: Warehouse,
      titleKey: "bondedInspectionWarehouse",
      descriptionKey: "bondedInspectionDesc",
      features: ["warehouseArea", "wmsSystem", "climateControl", "security247", "cargoInsurance"],
      image: "/img/service2.png",
    },
    {
      icon: Ship,
      titleKey: "internationalFreight",
      descriptionKey: "internationalFreightDesc",
      features: ["multiModal", "realTimeTracking", "internationalInsurance", "doorToDoor", "specialCargo"],
      image: "/img/service3.png",
    },
    {
      icon: Package,
      titleKey: "comprehensiveLogistics",
      descriptionKey: "comprehensiveLogisticsDesc",
      features: ["supplyChain", "packingLabeling", "distribution", "inventoryManagement", "reporting"],
      image: "/img/service4.png",
    },
    {
      icon: FileText,
      titleKey: "customsDeclaration",
      descriptionKey: "customsDeclarationDesc",
      features: ["importExportDeclaration", "taxConsulting", "specialPermits", "cargoInspection", "customsDispute"],
      image: "/img/service5.png",
    },
    {
      icon: Truck,
      titleKey: "importExportConsulting",
      descriptionKey: "importExportConsultingDesc",
      features: ["legalProcess", "businessLicense", "staffTraining", "costOptimization", "riskManagement"],
      image: "/img/service6.png",
    },
  ]

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

  return (
    <div className="min-h-screen">
      {/* Services Hero */}
      <section className="py-20 bg-gradient-to-r from-[#00b764]/10 to-[#1a3b2f]/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              {/* <nav className="text-gray-600 mb-4">
                <span>{t("home")}</span> &gt; <span>{t("services")}</span>
              </nav> */}
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a3b2f] mb-6">{t("servicesPageTitle")}</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t("servicesPageDesc")}</p>
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
                <Select>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder={t("serviceInterest")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transit">{t("transitCenter")}</SelectItem>
                    <SelectItem value="warehouse">{t("bondedWarehouse")}</SelectItem>
                    <SelectItem value="shipping">{t("internationalShipping")}</SelectItem>
                    <SelectItem value="customs">{t("customsClearance")}</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder={t("detailDescription")} rows={3} className="rounded-xl border-gray-200" />
                <Button className="w-full bg-[#00b764] hover:bg-[#00b764]/90 text-white rounded-xl">{t("sendRequest")}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("mainServices")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("mainServicesDesc")}</p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <Card key={index} className="shadow-xl overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={t(service.titleKey as any)}
                      className="w-full h-80 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div
                    className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? "lg:col-start-1" : ""}`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-[#e8f5ee] rounded-lg flex items-center justify-center mr-4">
                        <service.icon className="h-8 w-8 text-[#00b764]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1a3b2f]">{t(service.titleKey as any)}</h3>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">{t(service.descriptionKey as any)}</p>

                    <div className="mb-8">
                      <h4 className="font-bold text-[#1a3b2f] mb-4">{t("keyFeatures")}</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-[#f8fafc]">
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
