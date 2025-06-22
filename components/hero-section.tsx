"use client"

import { useState, useEffect } from "react"

const heroImages = [
  {
    src: "/img/banner1.png",
    alt: "Container ships at port",
  },
  {
    src: "/img/banner2.png",
    alt: "Warehouse operations",
  },
  {
    src: "/img/banner3.png",
    alt: "Truck logistics",
  },
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
      {/* Image Slideshow Background */}
      <div className="absolute inset-0 z-0 bg-[#f8fafc]">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              image.src === "/img/banner1.png" ? "object-contain" : "object-cover"
            } ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
