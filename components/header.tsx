"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { localeNames, localeFlags, type Locale } from "@/lib/i18n"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("trackContainer"), href: "/tracking" },
    { name: t("news"), href: "/news" },
    { name: t("careers"), href: "/careers" },
  ]

  const services = [
    { name: t("logisticsSupportService"), href: "/services/logistics-support" },
    { name: t("customsClearanceService"), href: "/services/customs-clearance" },
    { name: t("customsAgentService"), href: "/services/customs-agent" },
    { name: t("bondedWarehouseService"), href: "/services/bonded-warehouse" },
    { name: t("freightForwardingService"), href: "/services/freight-forwarding" },
    { name: t("passengerTransitCenter"), href: "/services/passenger-transit" },
    { name: t("landBusinessService"), href: "/services/land-business" },
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
            {/* Trang chủ */}
            <Link
              href="/"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              {t("home")}
            </Link>
            
            {/* Services Dropdown ngay sau Home */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-white/80 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-base [&_svg]:hidden">
                    {t("services")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white rounded-lg shadow-lg border border-gray-100">
                    <ul className="flex flex-col w-[280px] gap-1 p-3">
                      {services.map((service) => (
                        <li key={service.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={service.href}
                              className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-[#e8f5ee] hover:text-[#00b764] focus:bg-accent focus:text-accent-foreground text-gray-800"
                            >
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="mt-1 pt-1 border-t border-gray-100">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/services"
                            className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-[#e8f5ee] hover:text-[#00b764] focus:bg-accent focus:text-accent-foreground text-center font-medium text-gray-800"
                          >
                            {t("allServices")}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              
              {/* Custom styling cho NavigationMenuViewport */}
              <div className="absolute left-0 top-full flex justify-center">
                <NavigationMenuViewport className="bg-white rounded-lg border border-gray-100 shadow-lg origin-top-center" />
              </div>
            </NavigationMenu>
            
            {/* Về chúng tôi - đặt ngay sau Dịch vụ */}
            <Link
              href="/about"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              {t("about")}
            </Link>
            
            {/* Tra cứu Container - đặt ngay sau Về chúng tôi */}
            <Link
              href="/tracking"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              {t("trackContainer")}
            </Link>
            
            {/* Các mục còn lại (news, careers) */}
            {navigation.slice(3).map((item) => (
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
              <DropdownMenuContent className="bg-white border border-gray-100 shadow-lg rounded-lg">
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
                  {/* Trang chủ */}
                  <Link
                    href="/"
                    className="text-white hover:text-[#00b764] transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("home")}
                  </Link>
                  
                  {/* Services dropdown for mobile */}
                  <div className="flex flex-col space-y-2">
                    <p className="text-white text-lg font-medium">{t("services")}</p>
                    <div className="pl-4 flex flex-col space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="text-white/80 hover:text-[#00b764] transition-colors text-base"
                          onClick={() => setIsOpen(false)}
                        >
                          {service.name}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        className="text-white/80 hover:text-[#00b764] transition-colors text-base font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("allServices")}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Về chúng tôi - đặt ngay sau Dịch vụ */}
                  <Link
                    href="/about"
                    className="text-white hover:text-[#00b764] transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("about")}
                  </Link>
                  
                  {/* Tra cứu Container - đặt ngay sau Về chúng tôi */}
                  <Link
                    href="/tracking"
                    className="text-white hover:text-[#00b764] transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("trackContainer")}
                  </Link>
                  
                  {/* Các mục còn lại (news, careers) */}
                  {navigation.slice(3).map((item) => (
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
