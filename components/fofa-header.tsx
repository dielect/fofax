"use client"

import type React from "react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Languages, UserCircle, SearchIcon, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation" // Or from 'next/router' if using Pages Router

interface FofaHeaderProps {
  initialSearchQuery?: string
}

export default function FofaHeader({ initialSearchQuery = "" }: FofaHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page, assuming it's /search
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-fofa-dark/90 backdrop-blur-md text-fofa-gray-100 shadow-md"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1.5 text-xl font-bold text-fofa-cyan">
          <SearchIcon className="w-6 h-6 text-fofa-cyan transform -scale-x-100" />
          <span>FOFA</span>
        </Link>
        <form onSubmit={handleSearch} className="relative ml-4 w-72 md:w-96">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-4 pr-20 bg-slate-800/60 border-2 border-fofa-cyan/40 focus:border-fofa-cyan focus:ring-fofa-cyan text-fofa-gray-100 placeholder-fofa-gray-400 rounded-md text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            <Button variant="ghost" size="icon" className="text-fofa-gray-300 hover:text-fofa-cyan h-8 w-8">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="bg-fofa-cyan/20 text-fofa-cyan hover:bg-fofa-cyan/30 p-1.5 rounded-md ml-1 h-8 w-8"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
      <nav className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1 text-fofa-blue">
          <SearchIcon className="w-4 h-4 text-fofa-cyan transform -scale-x-100" /> {/* Placeholder for AI+ icon */}
          <span className="font-semibold">AI+</span>
          <Badge variant="destructive" className="bg-red-500 text-white text-xs px-1.5 py-0.5">
            beta
          </Badge>
        </div>
        <Link href="#" className="hover:text-fofa-cyan transition-colors">
          会员
        </Link>
        <Link href="#" className="hover:text-fofa-cyan transition-colors">
          支持及工具
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-fofa-gray-300 hover:text-fofa-cyan hover:bg-fofa-gray-400/10 h-8 w-8"
        >
          <Bell className="w-4 h-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-fofa-gray-300 hover:text-fofa-cyan hover:bg-fofa-gray-400/10 h-8 w-8"
        >
          <Languages className="w-4 h-4" />
          <span className="sr-only">Language</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-fofa-gray-300 hover:text-fofa-cyan hover:bg-fofa-gray-400/10 h-8 w-8"
        >
          <UserCircle className="w-5 h-5" />
          <span className="sr-only">User Profile</span>
        </Button>
      </nav>
    </motion.header>
  )
}
