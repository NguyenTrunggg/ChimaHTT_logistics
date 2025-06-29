"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

const partners = [
  { name: "DHL", logo: "/img/MB.png" },
  { name: "FedEx", logo: "/img/tlc.png" },
  { name: "UPS", logo: "/img/beelogistic.png" },
  { name: "TNT", logo: "/img/kalogistics.png" },
  { name: "Maersk", logo: "/img/agribank.png" },
  { name: "FedEx", logo: "/img/tlc.png" },
  { name: "UPS", logo: "/img/beelogistic.png" },
  { name: "TNT", logo: "/img/kalogistics.png" },
]

export function PartnersSection() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("partnersTitle")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("partnersSubtitle")}</p>
        </div>

        {/* Partners Display with Animation */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee space-x-16 px-4">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="flex items-center justify-center py-6">
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    className="max-h-40 max-w-full object-contain hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e8f5ee] overflow-hidden p-0">
              <img src="/img/iso-logo.png" alt="ISO 9001:2015" className="w-18 h-18 object-cover" />
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">ISO 9001:2015</h3>
            <p className="text-sm text-gray-600">{t("qualityCertification")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e8f5ee] overflow-hidden p-0">
              <img src="/img/aeo-logo.png" alt="AEO Certificate" className="w-18 h-18 object-cover" />
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">AEO Certificate</h3>
            <p className="text-sm text-gray-600">{t("trustedOperator")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e8f5ee] overflow-hidden p-0">
              <img src="/img/fiata-logo.png" alt="FIATA Member" className="w-18 h-18 object-cover" />
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">FIATA Member</h3>
            <p className="text-sm text-gray-600">{t("associationMember")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e8f5ee] overflow-hidden p-0">
              <img src="/img/wca-logo.png" alt="WCA Network" className="w-22 h-22 object-cover" />
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">WCA Network</h3>
            <p className="text-sm text-gray-600">{t("globalNetworkMember")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
