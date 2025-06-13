"use client"

import { type ReactNode, type FormEvent, type ChangeEvent } from "react"
import { Fragment, useMemo } from "react"

import FofaLogo from "@/components/fofa-logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim() && !isLoading) {
      setIsLoading(true)
      try {
        await router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      } catch (error) {
        console.error('Search navigation error:', error)
        setIsLoading(false)
      }
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const formatInputContent = (value: string) => {
    if (!value.trim()) {
      return null;
    }
    
    // 检查是否包含 key=value 格式
    const hasKeyValue = value.includes("=");
    if (!hasKeyValue) {
      return null;
    }
    
    const parts = value.includes("&&") ? value.split("&&") : [value];
    const elements: ReactNode[] = [];
    
    parts.forEach((part, index) => {
      // Check if part contains key=value format
      const isKeyValue = part.includes("=");
      let formattedPart;
      
      if (isKeyValue) {
        const [key, ...valueParts] = part.split("=");
        const value = valueParts.join("=");
        
        formattedPart = (
          <span className="flex items-center">
            <span className="text-fofa-cyan">{key.trim()}</span>
            <span className="text-fofa-gray-300">=</span>
            <span className="text-fofa-gray-100">{value.trim()}</span>
          </span>
        );
      } else {
        formattedPart = <span className="text-fofa-gray-100">{part.trim()}</span>;
      }
      
      elements.push(
        <Fragment key={index}>
          {formattedPart}
          {index < parts.length - 1 && (
            <span className="text-fofa-gray-400 font-bold">&&</span>
          )}
        </Fragment>
      );
    });
    
    return <div className="flex items-center gap-1 overflow-hidden">{elements}</div>;
  };

  const formattedContent = useMemo(() => {
    return formatInputContent(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100 overflow-hidden">
      {/* 全屏加载遮罩 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-fofa-dark/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4 p-8 rounded-lg bg-slate-800/50 border border-fofa-cyan/30"
            >
              <Loader2 className="w-8 h-8 text-fofa-cyan animate-spin" />
              <div className="text-fofa-gray-100 text-lg font-medium">搜索中...</div>
              <div className="text-fofa-gray-400 text-sm">正在为您准备搜索结果</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-8 w-full max-w-2xl"
        >
          <FofaLogo />

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className={`relative ${isFocused ? "gradient-border" : ""}`}>
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
                className={`w-full h-14 pl-5 ${!isFocused && formattedContent ? 'text-transparent' : 'text-fofa-gray-100'} pr-28 py-3 text-lg bg-slate-800/50 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-lg focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              
              {!isFocused && formattedContent && (
                <div 
                  className="absolute inset-0 pl-5 pr-28 flex items-center text-lg pointer-events-none z-20 overflow-hidden whitespace-nowrap"
                >
                  <div className="truncate w-full">
                    {formattedContent}
                  </div>
                </div>
              )}
              
              {searchQuery && !isLoading && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 z-20 group"
                >
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-fofa-gray-600/30 group-hover:bg-fofa-gray-600/50 transition-all duration-200">
                    <X className="w-3.5 h-3.5 text-fofa-gray-300 group-hover:text-fofa-gray-100 transition-colors" />
                  </span>
                </button>
              )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-20">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="text-fofa-cyan hover:text-fofa-cyan-light transition-colors p-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="flex items-center gap-1.5 text-sm text-fofa-gray-300 hover:text-fofa-cyan transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              查询语法
            </Link>
            <span className="text-fofa-gray-500">|</span>
            <Link
              href="/settings"
              className="text-sm text-fofa-gray-300 hover:text-fofa-cyan transition-colors"
            >
              API 设置
            </Link>
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        .gradient-border::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00a8ff, #00ff9d, #9d00ff, #00a8ff);
          background-size: 400% 400%;
          z-index: 0;
          border-radius: 0.5rem;
          animation: gradient 3s ease infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
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
    </div>
  )
}
