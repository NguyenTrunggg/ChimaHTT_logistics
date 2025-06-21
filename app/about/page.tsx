"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  const timeline = [
    {
      year: "2009",
      titleKey: "companyEstablishment",
      descriptionKey: "companyEstablishmentDesc",
    },
    {
      year: "2015",
      titleKey: "warehouseExpansion",
      descriptionKey: "warehouseExpansionDesc",
    },
    {
      year: "2020",
      titleKey: "chinaPartnership",
      descriptionKey: "chinaPartnershipDesc",
    },
    {
      year: "2025",
      titleKey: "technologyUpgrade",
      descriptionKey: "technologyUpgradeDesc",
    },
  ]

  const leadership = [
    {
      name: "Nguyễn Văn A",
      position: "CEO & Founder",
      bio: "Hơn 20 năm kinh nghiệm trong ngành logistics",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Trần Thị B",
      position: "COO",
      bio: "Chuyên gia về vận hành và quản lý chuỗi cung ứng",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Lê Văn C",
      position: "CTO",
      bio: "Dẫn dắt chuyển đổi số trong logistics",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const values = [
    {
      icon: Target,
      titleKey: "accuracy",
      descriptionKey: "accuracyDesc",
    },
    {
      icon: Users,
      titleKey: "collaboration",
      descriptionKey: "collaborationDesc",
    },
    {
      icon: Award,
      titleKey: "quality",
      descriptionKey: "qualityDesc",
    },
    {
      icon: Heart,
      titleKey: "dedication",
      descriptionKey: "dedicationDesc",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-[#00b764]/80 to-[#1a3b2f]/80 flex items-center">
        <div className="absolute inset-0">
          <img src="/img/banner_about.png" alt="About Us" className="w-full h-full object-cover" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#00b764]/80 to-[#1a3b2f]/80" /> */}
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <nav className="text-white/80 mb-4">
            {/* <span>{t("home")}</span> &gt; <span>{t("about")}</span> */}
          </nav>
          {/* <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("aboutPageTitle")}</h1> */}
        </div>
      </section>

      {/* Company Story Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("developmentHistory")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("developmentHistoryDesc")}</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#00b764]"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <Badge className="bg-[#00b764] text-white mb-3">{item.year}</Badge>
                        <h3 className="text-xl font-bold text-[#1a3b2f] mb-2">{t(item.titleKey as any)}</h3>
                        <p className="text-gray-600">{t(item.descriptionKey as any)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-[#00b764] rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-[#00b764] mr-3" />
                  <h3 className="text-2xl font-bold text-[#1a3b2f]">{t("mission")}</h3>
                </div>
                <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                  "{t("missionStatement")}"
                </blockquote>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-[#00b764] mr-3" />
                  <h3 className="text-2xl font-bold text-[#1a3b2f]">{t("vision")}</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#00b764] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t("visionPoint1")}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#00b764] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t("visionPoint2")}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-[#00b764] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t("visionPoint3")}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("coreValues")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("coreValuesDesc")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00b764] transition-colors">
                    <value.icon className="h-8 w-8 text-[#00b764] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3b2f] mb-3">{t(value.titleKey as any)}</h3>
                  <p className="text-gray-600">{t(value.descriptionKey as any)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("leadership")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("leadershipDesc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#1a3b2f] mb-1">{leader.name}</h3>
                  <p className="text-[#00b764] font-medium mb-3">{leader.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("certificationsAwards")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("certificationsAwardsDesc")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "ISO 9001:2015", descKey: "qualityCertification" },
              { name: "AEO Certificate", descKey: "trustedOperator" },
              { name: "FIATA Member", descKey: "associationMember" },
              { name: "WCA Network", descKey: "globalNetworkMember" },
              { name: "Green Logistics", descKey: "greenLogistics" },
              { name: "Best Service", descKey: "bestService" },
            ].map((cert, index) => (
              <Card
                key={index}
                className="text-center shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00b764] transition-colors">
                    <Award className="h-8 w-8 text-[#00b764] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1a3b2f] mb-2 text-sm">{cert.name}</h3>
                  <p className="text-gray-600 text-xs">{t(cert.descKey as any)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
