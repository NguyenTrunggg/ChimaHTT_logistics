"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category { id:number; name:string }

interface NewsCategoryTabsProps {
  categories: Category[]
  lang: string
}

export default function NewsCategoryTabs({ categories, lang }: NewsCategoryTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get('categoryId') || 'all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if(value==='all') params.delete('categoryId'); else params.set('categoryId', value);
    params.set('lang', lang);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-8">
      <Tabs value={current} onValueChange={handleChange} className="w-full">
        <TabsList className="w-full flex justify-start overflow-x-auto pb-2 bg-transparent border-b border-gray-200">
          <TabsTrigger value="all" className="px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:text-[#00b764] border-transparent">All</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={String(cat.id)} className="px-6 py-3 text-base font-medium rounded-none border-b-2 data-[state=active]:border-[#00b764] data-[state=active]:text-[#00b764] border-transparent">
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
} 