"use client"

import { type ReactNode, type FormEvent, type ChangeEvent } from "react"
import { Fragment, useMemo } from "react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, X, Settings, Menu, User, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAccountInfo, type AccountInfo } from "@/lib/api"
import { useSearch } from "@/lib/context/search-context"
import { useApiSettings } from "@/lib/context/api-settings-context"
import FofaLogo from "@/components/fofa-logo"

interface FofaHeaderProps {
  initialSearchQuery?: string
}

export default function FofaHeader({ 
  initialSearchQuery = ""
}: FofaHeaderProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [mobileFocused, setMobileFocused] = useState(false)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [localQuery, setLocalQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // Use settings context
  const { apiUrl, apiKey, isLoaded } = useApiSettings()
  
  // Use search context
  const { query, setQuery, performSearch } = useSearch()
  
  // Initialize search query from props or context
  useEffect(() => {
    // 优先使用URL参数中的查询词，因为它代表最新的用户意图
    if (initialSearchQuery !== localQuery) {
      setLocalQuery(initialSearchQuery)
    }
  }, [initialSearchQuery])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch account info when user clicks on avatar
  const handleUserClick = async () => {
    if (!isLoaded) return;
    
    if (!showUserDropdown) {
      setIsLoadingAccount(true)
      try {
        const data = await getAccountInfo(apiUrl, apiKey)
        setAccountInfo(data)
      } catch (error) {
        console.error("Failed to fetch account info:", error)
      } finally {
        setIsLoadingAccount(false)
      }
    }
    
    setShowUserDropdown(!showUserDropdown)
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
    return formatInputContent(localQuery);
  }, [localQuery]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (localQuery.trim()) {
      if (pathname === '/search') {
        router.replace(`/search?q=${encodeURIComponent(localQuery.trim())}`)
      } else {
        router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`)
      }
      setShowMobileMenu(false)
    }
  }

  const clearSearch = () => {
    setLocalQuery("")
    setQuery("") // Also clear the context query
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-fofa-dark/90 backdrop-blur-md text-fofa-gray-100 shadow-md"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-fofa-cyan"
              >
                <Menu size={24} />
              </Button>
              
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-fofa-cyan transition-transform duration-300 hover:scale-105"
              >
                <FofaLogo variant="header" />
              </Link>
            </div>
            
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:block relative w-1/2 max-w-lg">
              <div className="relative gradient-container">
                <motion.div
                  className={isFocused ? "gradient-border" : ""}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search..."
                    value={localQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full h-11 pl-4 pr-14 ${!isFocused && formattedContent ? 'text-transparent' : 'text-fofa-gray-100'} bg-slate-800/60 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-md text-sm focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none transition-all duration-300`}
                  />
                  
                  {!isFocused && formattedContent && (
                    <div 
                      className={`absolute inset-0 pl-4 ${localQuery ? 'pr-20' : 'pr-14'} flex items-center text-sm pointer-events-none z-20 overflow-hidden whitespace-nowrap`}
                    >
                      <div className="truncate w-full">
                        {formattedContent}
                      </div>
                    </div>
                  )}
                </motion.div>
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-20">
                  {localQuery && (
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
          </div>
          
          {/* Desktop user avatar */}
          <div className="hidden md:flex items-center relative" ref={userDropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUserClick}
              className="group p-2 transition-all duration-300"
            >
              <User className="w-6 h-6 text-slate-400 group-hover:text-fofa-cyan transition-colors duration-300" />
            </motion.button>
            
            {/* User dropdown */}
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4">
                    {isLoadingAccount ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fofa-cyan"></div>
                        <span className="ml-2 text-fofa-gray-300">加载中...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                          <User className="w-8 h-8 text-slate-300" />
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-fofa-gray-100 font-medium">{accountInfo?.username || '用户'}</p>
                              {accountInfo?.isvip && (
                                <div className="w-4 h-4 bg-gradient-to-br from-fofa-cyan/80 to-blue-500/80 rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-fofa-gray-400">{accountInfo?.email || ''}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-xs text-fofa-gray-400 mb-1">剩余可使用量</p>
                            <p className="text-lg text-fofa-cyan font-medium">{accountInfo?.remain_api_query || 0}</p>
                          </div>
                          <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-xs text-fofa-gray-400 mb-1">有效期至</p>
                            <p className="text-sm text-fofa-cyan font-medium">{accountInfo?.expiration || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden px-4 py-3 border-t border-slate-700/50 bg-fofa-dark/90">
            <form onSubmit={handleSearch} className="relative w-full mb-4">
              <div className="relative gradient-container">
                <motion.div
                  className={mobileFocused ? "gradient-border" : ""}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Input
                    ref={mobileInputRef}
                    type="search"
                    placeholder="Search..."
                    value={localQuery}
                    onChange={handleInputChange}
                    onFocus={() => setMobileFocused(true)}
                    onBlur={() => setMobileFocused(false)}
                    className={`w-full h-11 pl-4 pr-14 ${!mobileFocused && formattedContent ? 'text-transparent' : 'text-fofa-gray-100'} bg-slate-800/60 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-md text-sm focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none transition-all duration-300`}
                  />
                  
                  {!mobileFocused && formattedContent && (
                    <div 
                      className={`absolute inset-0 pl-4 ${localQuery ? 'pr-20' : 'pr-14'} flex items-center text-sm pointer-events-none z-20 overflow-hidden whitespace-nowrap`}
                    >
                      <div className="truncate w-full">
                        {formattedContent}
                      </div>
                    </div>
                  )}
                </motion.div>
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-20">
                  {localQuery && (
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
            
            {/* Mobile user info - Click to show */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleUserClick}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 border border-slate-700/20 hover:border-slate-600/30"
            >
              <User className="w-7 h-7 text-slate-300" />
              <div className="flex-1 text-left">
                <p className="text-fofa-gray-100 font-medium">账户信息</p>
                <p className="text-xs text-fofa-gray-400">点击查看详情</p>
              </div>
            </motion.button>
            
            {/* Mobile user dropdown */}
            <AnimatePresence>
              {showUserDropdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    {isLoadingAccount ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fofa-cyan"></div>
                        <span className="ml-2 text-fofa-gray-300">加载中...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center pb-3 border-b border-slate-700/50">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-fofa-gray-100 font-medium">{accountInfo?.username || '用户'}</p>
                            {accountInfo?.isvip && (
                              <div className="w-4 h-4 bg-gradient-to-br from-fofa-cyan/80 to-blue-500/80 rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-fofa-gray-400">{accountInfo?.email || ''}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                            <p className="text-xs text-fofa-gray-400 mb-1">剩余可使用量</p>
                            <p className="text-lg text-fofa-cyan font-medium">{accountInfo?.remain_api_query || 0}</p>
                          </div>
                          <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                            <p className="text-xs text-fofa-gray-400 mb-1">有效期至</p>
                            <p className="text-sm text-fofa-cyan font-medium">{accountInfo?.expiration || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
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
