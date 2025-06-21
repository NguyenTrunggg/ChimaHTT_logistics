"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

const partners = [
  { name: "DHL", logo: "/img/MB.png" },
  { name: "FedEx", logo: "/img/tlc.png" },
  { name: "UPS", logo: "/img/beelogistic.png" },
  { name: "TNT", logo: "/img/kalogistics.png" },
  { name: "Maersk", logo: "/img/agribank.png" },
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

        {/* Partners Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="flex-shrink-0 w-1/2 md:w-1/4 px-4">
                <div className="bg-gray-50 rounded-lg p-6 h-4040 flex items-center justify-center group hover:bg-white hover:shadow-md transition-all duration-300">
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    className="max-h-28 max-w-full object-contain transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00b764] font-bold text-lg">ISO</span>
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">ISO 9001:2015</h3>
            <p className="text-sm text-gray-600">{t("qualityCertification")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00b764] font-bold text-lg">AEO</span>
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">AEO Certificate</h3>
            <p className="text-sm text-gray-600">{t("trustedOperator")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00b764] font-bold text-lg">FIATA</span>
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">FIATA Member</h3>
            <p className="text-sm text-gray-600">{t("associationMember")}</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#00b764] font-bold text-lg">WCA</span>
            </div>
            <h3 className="font-semibold text-[#1a3b2f]">WCA Network</h3>
            <p className="text-sm text-gray-600">{t("globalNetworkMember")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
