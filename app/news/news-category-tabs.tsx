"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface NewsCategoryTabsProps {
  categories: {
    all: string
    events: string
    internal: string
    industry: string
  }
}

export default function NewsCategoryTabs({ categories }: NewsCategoryTabsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // In a real application, you would update the URL with a query parameter
    // and filter the news accordingly
    if (value === "all") {
      router.push("/news")
    } else {
      router.push(`/news?category=${value}`)
    }
  }
  
  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-1 h-auto gap-2 bg-transparent">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-[#00b764] data-[state=active]:text-white transition-all"
        >
          {categories.all}
        </TabsTrigger>
        <TabsTrigger 
          value="events" 
          className="data-[state=active]:bg-[#00b764] data-[state=active]:text-white transition-all"
        >
          {categories.events}
        </TabsTrigger>
        <TabsTrigger 
          value="internal" 
          className="data-[state=active]:bg-[#00b764] data-[state=active]:text-white transition-all"
        >
          {categories.internal}
        </TabsTrigger>
        <TabsTrigger 
          value="industry" 
          className="data-[state=active]:bg-[#00b764] data-[state=active]:text-white transition-all"
        >
          {categories.industry}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
} 