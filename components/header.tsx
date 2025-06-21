"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { localeNames, localeFlags, type Locale } from "@/lib/i18n"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("news"), href: "/news" },
    { name: t("careers"), href: "/careers" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#00b764] to-[#009f56] backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/img/logo.png" alt="Chi Ma HTT Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-white/80 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Globe className="h-4 w-4 mr-1" />
                  {locale.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-100 shadow-lg">
                <DropdownMenuItem onClick={() => setLocale("vi" as Locale)} className="hover:bg-gray-50">
                  {localeFlags.vi} {localeNames.vi}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en" as Locale)} className="hover:bg-gray-50">
                  {localeFlags.en} {localeNames.en}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("cn" as Locale)} className="hover:bg-gray-50">
                  {localeFlags.cn} {localeNames.cn}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Contact CTA */}
            <Link href="/contact">
              <Button className="bg-white text-[#00b764] hover:bg-white/90 hidden md:flex">{t("contact")}</Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#1a3b2f]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:text-[#00b764] transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/contact">
                    <Button className="bg-[#00b764] text-white hover:bg-[#00b764]/90 mt-4">{t("contact")}</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
