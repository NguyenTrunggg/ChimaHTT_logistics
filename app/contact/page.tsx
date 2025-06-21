"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()

  const contactInfo = [
    {
      icon: MapPin,
      titleKey: "officeAddress",
      content: t("officeAddress"),
    },
    {
      icon: Phone,
      titleKey: "phoneNumber",
      content: "+84 25 3851 234\n+84 25 3851 235 (Fax)",
    },
    {
      icon: Mail,
      titleKey: "email",
      content: "info@chimahtt.com\nsupport@chimahtt.com",
    },
  ]

  const faqData = [
    {
      categoryKey: "shipping",
      questions: [
        {
          qKey: "shippingTimeQ",
          aKey: "shippingTimeA",
        },
        {
          qKey: "dangerousGoodsQ",
          aKey: "dangerousGoodsA",
        },
      ],
    },
    {
      categoryKey: "customs",
      questions: [
        {
          qKey: "documentsQ",
          aKey: "documentsA",
        },
      ],
    },
    {
      categoryKey: "pricing",
      questions: [
        {
          qKey: "shippingCostQ",
          aKey: "shippingCostA",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl" id="contact-form">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#1a3b2f] flex items-center">
                  <Send className="h-6 w-6 mr-3 text-[#00b764]" />
                  {t("sendContact")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("fullName")} *</label>
                    <Input placeholder={t("fullName")} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("phoneNumber")} *</label>
                    <Input placeholder={t("phoneNumber")} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("email")} *</label>
                  <Input type="email" placeholder={t("email")} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("serviceInterest")}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("serviceInterest")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transit">{t("transitCenter")}</SelectItem>
                      <SelectItem value="warehouse">{t("bondedWarehouse")}</SelectItem>
                      <SelectItem value="shipping">{t("internationalShipping")}</SelectItem>
                      <SelectItem value="customs">{t("customsClearance")}</SelectItem>
                      <SelectItem value="consulting">{t("importExportConsulting")}</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("messageContent")} *</label>
                  <Textarea placeholder={t("detailDescription")} rows={5} />
                </div>

                <Button
                  className="w-full bg-[#00b764] hover:bg-[#00b764]/90 text-white py-3"
                  onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t("sendContact")}
                </Button>

                <p className="text-sm text-gray-500 text-center">{t("requiredFields")}</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1a3b2f] mb-6">{t("contactInfo")}</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-[#e8f5ee] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <info.icon className="h-6 w-6 text-[#00b764]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#1a3b2f] mb-2">{t(info.titleKey as any)}</h3>
                            <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#e8f5ee] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#00b764]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3b2f] mb-2">{t("officeHours")}</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>{t("mondayFriday")}</p>
                        <p>{t("saturday")}</p>
                        <p>{t("sunday")}</p>
                        <p className="text-[#00b764] font-medium mt-2">{t("hotline247")}: 1900 1234</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("officeLocation")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("officeLocationDesc")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="relative">
              <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.4404874319634!2d107.01978641492127!3d21.8129954855654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36b533e5c57c4a63%3A0xd06609ecfefd3282!2zQ8OUTkcgVFkgQ1AgRFYgWFXhuqRUIE5I4bqsUCBLSOG6qFUgVEggQ0hJIE1BSFRU!5e0!3m2!1svi!2s!4v1719715348712!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chi Ma HTT Location Map"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1a3b2f] mb-4">{t("travelGuide")}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t("fromHanoi")}</h4>
                      <p className="text-gray-600 text-sm">{t("fromHanoiDesc")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t("fromLangSon")}</h4>
                      <p className="text-gray-600 text-sm">{t("fromLangSonDesc")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">{t("publicTransport")}</h4>
                      <p className="text-gray-600 text-sm">{t("publicTransportDesc")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#1a3b2f] mb-4">{t("supportServices")}</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#00b764] rounded-full mr-3"></div>
                      {t("airportPickup")}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#00b764] rounded-full mr-3"></div>
                      {t("hotelBooking")}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#00b764] rounded-full mr-3"></div>
                      {t("translation")}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#00b764] rounded-full mr-3"></div>
                      {t("procedureGuide")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3b2f] mb-4">{t("faq")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("faqDesc")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h3 className="text-xl font-bold text-[#1a3b2f] mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 text-[#00b764] mr-2" />
                  {t(category.categoryKey as any)}
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border border-gray-200 rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline hover:text-[#00b764] transition-colors">
                        {t(faq.qKey as any)}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">{t(faq.aKey as any)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">{t("faqNotFound")}</p>
            <Button
              className="bg-[#00b764] hover:bg-[#00b764]/90 text-white px-8 py-3"
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("contactDirect")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
