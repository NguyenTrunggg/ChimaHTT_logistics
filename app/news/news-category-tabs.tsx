"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NewsCategoryTabsProps {
  categories: {
    all: string
    events: string
    internal: string
    industry: string
    [key: string]: string
  }
}

export default function NewsCategoryTabs({ categories }: NewsCategoryTabsProps) {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="mb-8">
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full flex justify-start overflow-x-auto pb-2 bg-transparent border-b border-gray-200">
          <TabsTrigger 
            value="all"
            className={`px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:bg-transparent data-[state=active]:text-[#00b764] border-transparent transition-all`}
          >
            — {categories.all}
          </TabsTrigger>
          <TabsTrigger 
            value="events"
            className={`px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:bg-transparent data-[state=active]:text-[#00b764] border-transparent transition-all`}
          >
            {categories.events}
          </TabsTrigger>
          <TabsTrigger 
            value="internal" 
            className={`px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:bg-transparent data-[state=active]:text-[#00b764] border-transparent transition-all`}
          >
            {categories.internal}
          </TabsTrigger>
          <TabsTrigger 
            value="industry"
            className={`px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:bg-transparent data-[state=active]:text-[#00b764] border-transparent transition-all`}
          >
            {categories.industry}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
} 