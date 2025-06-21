"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Shield, Users, Award, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

const reasons = [
  {
    icon: CheckCircle,
    titleKey: "experience15Years",
    descriptionKey: "experience15YearsDesc",
  },
  {
    icon: Clock,
    titleKey: "service247",
    descriptionKey: "service247Desc",
  },
  {
    icon: Shield,
    titleKey: "absoluteSafety",
    descriptionKey: "absoluteSafetyDesc",
  },
  {
    icon: Users,
    titleKey: "professionalTeam",
    descriptionKey: "professionalTeamDesc",
  },
  {
    icon: Award,
    titleKey: "isoCertification",
    descriptionKey: "isoCertificationDesc",
  },
  {
    icon: Globe,
    titleKey: "globalNetwork",
    descriptionKey: "globalNetworkDesc",
  },
]

export function WhyChooseUs() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/img/why3.png"
                alt="Warehouse facility"
                className="w-full h-52 object-cover rounded-lg shadow-md"
              />
              <img
                src="/img/why2.png"
                alt="Logistics operations"
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img
                src="/img/why1.png"
                alt="Container handling"
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
              <img
                src="/img/why4.png"
                alt="Truck fleet"
                className="w-full h-52 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-6">{t("whyChooseTitle")}</h2>

            <div className="space-y-4 mb-8">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#e8f5ee] rounded-full flex items-center justify-center mt-1">
                    <reason.icon className="h-4 w-4 text-[#00b764]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a3b2f] mb-1">{t(reason.titleKey as any)}</h3>
                    <p className="text-gray-600 text-sm">{t(reason.descriptionKey as any)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button className="bg-[#00b764] hover:bg-[#00b764]/90 text-white px-8 py-3">{t("aboutUsBtn")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
