"use client"

import type React from "react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAccountInfo, type AccountInfo } from "@/lib/api"
import { useSearch } from "@/lib/context/search-context"

interface FofaHeaderProps {
  initialSearchQuery?: string
}

export default function FofaHeader({ 
  initialSearchQuery = ""
}: FofaHeaderProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  // Use search context
  const { query, setQuery, performSearch } = useSearch()
  
  // Initialize search query from props or context
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== query) {
      setQuery(initialSearchQuery)
    }
  }, [initialSearchQuery, query, setQuery])

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true)
      try {
        const data = await getAccountInfo()
        setAccountInfo(data)
      } catch (error) {
        console.error("Failed to fetch account info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccountInfo()
  }, [])

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      // Perform the search through context
      await performSearch(query)
      // Navigate to search results page with the query parameter
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  // Format the key status based on the isvip field
  const keyStatus = accountInfo?.isvip ? "有效" : "无效"

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 bg-fofa-dark/90 backdrop-blur-md text-fofa-gray-100 shadow-md"
      >
        <div className="flex items-center w-full">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xl font-bold text-fofa-cyan transition-transform duration-300 hover:scale-105 mr-4"
          >
            <motion.div
              whileHover={{ rotate: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <SearchIcon className="w-6 h-6 text-fofa-cyan transform -scale-x-100" />
            </motion.div>
            <span>FOFA</span>
          </Link>
          
          <form onSubmit={handleSearch} className="relative w-1/2">
            <div className="relative gradient-container">
              <motion.div
                className={isFocused ? "gradient-border" : ""}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Input
                  type="search"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-11 pl-4 pr-14 bg-slate-800/60 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 text-fofa-gray-100 placeholder-fofa-gray-400 rounded-md text-sm focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none transition-all duration-300"
                />
              </motion.div>
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-20">
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearSearch}
                    className="mr-1 group"
                  >
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-fofa-gray-600/30 group-hover:bg-fofa-gray-600/50 transition-all duration-200">
                      <X className="w-4 h-4 text-fofa-gray-300 group-hover:text-fofa-gray-100 transition-colors" />
                    </span>
                  </motion.button>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                  className="ml-1"
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-fofa-cyan p-1.5 h-9 w-9 transition-colors duration-300 hover:bg-transparent"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </form>
          
          <div className="ml-auto flex items-center gap-2">
            {isLoading ? (
              <div className="text-fofa-gray-200 text-sm font-medium">
                <Badge variant="outline" className="border-fofa-cyan/40 bg-fofa-dark/80 px-3 py-1 text-fofa-cyan">
                  Loading...
                </Badge>
              </div>
            ) : (
              <>
                {accountInfo?.isvip && (
                  <>
                    <div className="text-fofa-gray-200 text-sm font-medium">
                      <Badge variant="outline" className="border-fofa-cyan/40 bg-fofa-dark/80 px-3 py-1 text-fofa-cyan flex items-center gap-1">
                        <svg className="w-4 h-4 text-fofa-cyan" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5c-1.51 0-2.816.917-3.437 2.25-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                        认证用户
                      </Badge>
                    </div>
                    <div className="text-fofa-gray-200 text-sm">|</div>
                  </>
                )}
                <div className="text-fofa-gray-200 text-sm font-medium">
                  <Badge variant="outline" className="border-fofa-cyan/40 bg-fofa-dark/80 px-3 py-1 text-fofa-cyan">
                    剩余可使用量：{accountInfo?.remain_api_query || 0}
                  </Badge>
                </div>
                <div className="text-fofa-gray-200 text-sm">|</div>
                <div className="text-fofa-gray-200 text-sm font-medium">
                  <Badge variant="outline" className="border-fofa-cyan/40 bg-fofa-dark/80 px-3 py-1 text-fofa-cyan">
                    有效期至：{accountInfo?.expiration || 'N/A'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <style jsx global>{`
        .gradient-container {
          position: relative;
          z-index: 0;
        }
        
        .gradient-border::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00a8ff, #00ff9d, #9d00ff, #00a8ff);
          background-size: 400% 400%;
          z-index: -1;
          border-radius: 0.5rem;
          animation: gradient 3s ease infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
          pointer-events: none;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  )
}
