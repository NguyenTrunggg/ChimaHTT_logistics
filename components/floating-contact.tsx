"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Zap, Headphones } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export function FloatingContact() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useLanguage()

  const contactOptions = [
    {
      icon: Phone,
      labelKey: "phone",
      href: "tel:+842538512345",
      bgColor: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: MessageCircle,
      labelKey: "message",
      href: "sms:+842538512345",
      bgColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Zap,
      labelKey: "zalo",
      href: "https://zalo.me/0842538512345",
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
  ]

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-end space-y-3">
        {/* Contact Options */}
        <div
          className={`flex flex-col space-y-3 transition-all duration-300 ${
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.href}
              target={option.href.startsWith("http") ? "_blank" : undefined}
              rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group flex items-center space-x-2 ${option.bgColor} text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
            >
              <option.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">{t(option.labelKey as any)}</span>
            </a>
          ))}
        </div>

        {/* Main Contact Button */}
        <Link href="/contact">
          <Button
            className={`w-14 h-14 rounded-full bg-[#00b764] hover:bg-[#00b764]/90 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 ${
              isExpanded ? "scale-110" : ""
            }`}
          >
            <Headphones className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
