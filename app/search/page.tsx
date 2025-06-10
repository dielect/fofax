"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import FofaHeader from "@/components/fofa-header"
import SubHeaderFilters from "@/components/sub-header-filters"
import LeftSidebar from "@/components/left-sidebar"
import ResultItem, { type ResultItemData } from "@/components/result-item"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Star, Download, LayoutGrid, List, BarChart2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Mock API function
async function fetchResults(query: string): Promise<ResultItemData[]> {
  console.log("Fetching results for:", query)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  // Replace with actual API call
  return [
    {
      id: "1",
      url: "https://47.97.8.111",
      ip: "47.97.8.111",
      port: 443,
      title: "小红书AI-免费在线小红书AI创作工具，AI生成小红书爆款文案-小红书AI",
      location: { country: "中国", region: "浙江省", city: "Hangzhou", flag: "/flags/cn.png" },
      asn: "37963",
      organization: "Hangzhou Alibaba Advertising Co.,Ltd.",
      date: "2025-06-10",
      tech: ["nginx"],
      httpHeaders: `HTTP/1.1 200 OK
Connection: close
Content-Length: 31024
Accept-Ranges: bytes
Content-Type: text/html
Date: Tue, 10 Jun 2025 02:12:07 GMT
ETag: "662cf75a-7930"
Last-Modified: Sat, 27 Apr 2024 13:02:18 GMT
Server: nginx
Strict-Transport-Security: max-age=31536000`,
      certificateInfo: "Certificate details here...",
      tags: ["15af97...", "TLS 1.3", "3fd3fd..."],
      products: ["Product A", "Service B"],
    },
    // Add more mock data items
  ]
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || "title='小红书'" // Default query from screenshot
  const [results, setResults] = useState<ResultItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      setLoading(true)
      setError(null)
      fetchResults(query)
        .then(setResults)
        .catch((err) => {
          console.error("Failed to fetch results:", err)
          setError("Failed to load results.")
        })
        .finally(() => setLoading(false))
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query])

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100 pt-16">
      {" "}
      {/* pt for fixed header */}
      <FofaHeader initialSearchQuery={query} />
      <SubHeaderFilters />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between text-sm text-fofa-gray-300 mb-3 p-3 bg-fofa-dark/30 rounded-md border border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-fofa-gray-300 hover:text-fofa-cyan">
                <SlidersHorizontal size={16} className="mr-1.5" /> all
              </Button>
              <span>
                <strong className="text-fofa-cyan">12,432</strong> 条匹配结果 (
                <strong className="text-fofa-cyan">2,223</strong> 条独立IP),
                <strong className="text-fofa-cyan">2557</strong> ms, 关键词搜索.
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-fofa-gray-300 hover:text-fofa-cyan h-8 w-8">
                <Star size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-fofa-gray-300 hover:text-fofa-cyan h-8 w-8">
                <Download size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-fofa-gray-300 hover:text-fofa-cyan h-8 w-8">
                API
              </Button>
              <div className="flex items-center border border-fofa-cyan/30 rounded-md ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-fofa-cyan bg-fofa-cyan/10 h-7 w-7 rounded-r-none border-r border-fofa-cyan/30"
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-fofa-gray-300 hover:text-fofa-cyan h-7 w-7 rounded-none"
                >
                  <List size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-fofa-gray-300 hover:text-fofa-cyan h-7 w-7 rounded-l-none border-l border-fofa-cyan/30"
                >
                  <BarChart2 size={18} />
                </Button>
              </div>
            </div>
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-fofa-cyan" />
            </div>
          )}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-fofa-gray-400 text-center py-10">No results found for "{query}".</p>
          )}
          {!loading && !error && results.map((item) => <ResultItem key={item.id} item={item} />)}
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-fofa-dark">
          <Loader2 className="h-16 w-16 animate-spin text-fofa-cyan" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
