"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#1a3b2f] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold">Chi Ma HTT</div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">{t("companyDescription")}</p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-white/80 hover:text-white transition-colors">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 hover:text-white transition-colors">
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/80 hover:text-white transition-colors">
                  {t("careers")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contactInfo")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#00b764] mt-0.5 flex-shrink-0" />
                <span className="text-white/80">{t("officeAddress")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#00b764] flex-shrink-0" />
                <span className="text-white/80">0987461811</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#00b764] flex-shrink-0" />
                <span className="text-white/80">duydq@chimahtt.com</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-[#00b764]/20 rounded-lg">
              <p className="text-sm text-white/90 font-medium">{t("hotline247")}</p>
              <p className="text-lg font-bold text-[#00b764]">0987461811</p>
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("officeLocation")}</h3>
            <div className="rounded-lg overflow-hidden h-40 mb-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.4404874319634!2d107.01978641492127!3d21.8129954855654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36b533e5c57c4a63%3A0xd06609ecfefd3282!2zQ8OUTkcgVFkgQ1AgRFYgWFXhuqRUIE5I4bqsUCBLSOG6qFUgVEggQ0hJIE1BSFRU!5e0!3m2!1svi!2s!4v1719715348712!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chi Ma HTT Location Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">{t("copyright")}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                {t("termsOfUse")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
