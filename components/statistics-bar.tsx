"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

interface StatItem {
  labelKey: string
  value: number
  suffix: string
}

const stats: StatItem[] = [
  { labelKey: "experienceYears", value: 15, suffix: "+ " },
  { labelKey: "containersHandled", value: 100000, suffix: "+" },
  { labelKey: "partners", value: 50, suffix: "+" },
  { labelKey: "satisfactionRate", value: 98, suffix: "%" },
]

function CounterAnimation({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="text-3xl md:text-4xl font-bold text-[#00b764]">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatisticsBar() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-white shadow-lg relative -mt-10 z-10">
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <CounterAnimation value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-600 mt-2 font-medium">{t(stat.labelKey as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
