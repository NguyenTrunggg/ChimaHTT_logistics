import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingContact } from "@/components/floating-contact"
import { LanguageProvider } from "@/contexts/language-context"

export const metadata: Metadata = {
  title: "Chi Ma HTT Logistics - Giải pháp Logistics Toàn cầu",
  description:
    "15 năm kinh nghiệm trong lĩnh vực logistics tại cửa khẩu Chi Ma. Cung cấp dịch vụ vận chuyển, kho bãi và khai báo hải quan chuyên nghiệp.",
  icons: {
    icon: [
      { url: '/img/logo.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
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
