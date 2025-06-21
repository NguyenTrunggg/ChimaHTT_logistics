import { HeroSection } from "@/components/hero-section"
import { StatisticsBar } from "@/components/statistics-bar"
import { ServicesOverview } from "@/components/services-overview"
import { WhyChooseUs } from "@/components/why-choose-us"
import { LatestNews } from "@/components/latest-news"
import { PartnersSection } from "@/components/partners-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatisticsBar />
      <ServicesOverview />
      <WhyChooseUs />
      <LatestNews />
      <PartnersSection />
    </main>
  )
}
