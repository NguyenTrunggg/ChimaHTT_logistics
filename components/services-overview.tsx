"use client"

  import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Warehouse, Ship, FileText, ArrowRight, Building, Users, Plane } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const services = [
  {
    icon: Truck,
    titleKey: "logisticsSupportService" as const,
    descriptionKey: "logisticsSupportDesc" as const,
    href: "/services/logistics-support",
  },
  {
    icon: FileText,
    titleKey: "customsClearanceService" as const,
    descriptionKey: "customsClearanceDesc" as const,
    href: "/services/customs-clearance",
  },
  {
    icon: Building,
    titleKey: "customsAgentService" as const,
    descriptionKey: "customsAgentDesc" as const,
    href: "/services/customs-agent",
  },
  {
    icon: Warehouse,
    titleKey: "bondedWarehouseService" as const,
    descriptionKey: "bondedWarehouseDesc" as const,
    href: "/services/bonded-warehouse",
  },
  {
    icon: Ship,
    titleKey: "freightForwardingService" as const,
    descriptionKey: "freightForwardingDesc" as const,
    href: "/services/freight-forwarding",
  },
  {
    icon: Users,
    titleKey: "passengerTransitCenter" as const,
    descriptionKey: "passengerTransitDesc" as const,
    href: "/services/passenger-transit",
  },
  {
    icon: Building,
    titleKey: "landBusinessService" as const,
    descriptionKey: "landBusinessDesc" as const,
    href: "/services/land-business",
  },
]

export function ServicesOverview() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("servicesTitle")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("servicesSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md h-full cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-[#e8f5ee] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00b764] transition-colors">
                    <service.icon className="h-8 w-8 text-[#00b764] group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#1a3b2f]">{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 text-base leading-relaxed">
                    {t(service.descriptionKey)}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    className="text-[#00b764] hover:text-[#00b764] hover:bg-[#e8f5ee] p-0 h-auto font-medium group"
                  >
                    {t("learnMoreBtn")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services">
            <Button className="bg-[#00b764] hover:bg-[#009f56] text-white px-8 py-3 text-lg font-medium">
              {t("allServices")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
