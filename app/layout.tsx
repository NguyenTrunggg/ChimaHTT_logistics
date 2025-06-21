import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingContact } from "@/components/floating-contact"
import { LanguageProvider } from "@/contexts/language-context"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chi Ma HTT Logistics - Giải pháp Logistics Toàn cầu",
  description:
    "15 năm kinh nghiệm trong lĩnh vực logistics tại cửa khẩu Chi Ma. Cung cấp dịch vụ vận chuyển, kho bãi và khai báo hải quan chuyên nghiệp.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
          <FloatingContact />
        </LanguageProvider>
      </body>
    </html>
  )
}
