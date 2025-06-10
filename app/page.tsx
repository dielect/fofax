"use client"

import type React from "react"

import FofaHeader from "@/components/fofa-header"
import FofaLogo from "@/components/fofa-logo"
import FofaFooter from "@/components/fofa-footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MoreHorizontal, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100 overflow-hidden">
      <FofaHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-8 w-full max-w-2xl"
        >
          <FofaLogo />

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-5 pr-28 py-3 text-lg bg-slate-800/50 border-2 border-fofa-cyan/30 focus:border-fofa-cyan focus:ring-fofa-cyan text-fofa-gray-100 placeholder-fofa-gray-400 rounded-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button variant="ghost" size="icon" className="text-fofa-gray-300 hover:text-fofa-cyan">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="bg-fofa-cyan/20 text-fofa-cyan hover:bg-fofa-cyan/30 p-2 rounded-md ml-1"
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </form>

          <Link
            href="#"
            className="flex items-center gap-1.5 text-sm text-fofa-gray-300 hover:text-fofa-cyan transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            查询语法
          </Link>
        </motion.div>
      </main>

      <FofaFooter />
    </div>
  )
}
