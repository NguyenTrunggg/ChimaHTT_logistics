import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import ClientRootLayout from "@/components/client-root-layout"

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
          <ClientRootLayout>{children}</ClientRootLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
