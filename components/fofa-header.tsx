"use client"

import { type ReactNode, type FormEvent, type ChangeEvent } from "react"
import { Fragment } from "react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, X, Settings, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
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
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [localQuery, setLocalQuery] = useState("")
  const [formattedContent, setFormattedContent] = useState<ReactNode>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [mobileFormattedContent, setMobileFormattedContent] = useState<ReactNode>(null)
  const [mobileCursorPosition, setMobileCursorPosition] = useState(0)
  const [mobileFocused, setMobileFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Use settings context
  const { apiUrl, apiKey, isLoaded } = useApiSettings()
  
  // Use search context
  const { query, setQuery, performSearch } = useSearch()
  
  // Initialize search query from props or context
  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery !== localQuery) {
      setLocalQuery(initialSearchQuery)
    } else if (query && query !== localQuery) {
      setLocalQuery(query)
    }
  }, [initialSearchQuery, query])

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!isLoaded) return; // Wait until API settings are loaded
      
      setIsLoading(true)
      try {
        const data = await getAccountInfo(apiUrl, apiKey)
        setAccountInfo(data)
      } catch (error) {
        console.error("Failed to fetch account info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      fetchAccountInfo()
    }
  }, [apiUrl, apiKey, isLoaded])

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

  const formatInputContent = (value: string, cursorPos: number) => {
    if (!value.includes("&&")) {
      return { content: null, cursorOffset: 0 };
    }
    
    const parts = value.split("&&");
    let charCount = 0;
    let cursorOffset = 0;
    const elements: ReactNode[] = [];
    
    parts.forEach((part, index) => {
      const partStart = charCount;
      const partEnd = charCount + part.length;
      
      // Check if cursor is in this part
      const isCursorInPart = cursorPos >= partStart && cursorPos <= partEnd;
      
      // Check if part contains key=value format
      const isKeyValue = part.includes("=");
      let formattedPart;
      
      if (isKeyValue) {
        const [key, ...valueParts] = part.split("=");
        const value = valueParts.join("=");
        const keyStart = partStart;
        const keyEnd = keyStart + key.length;
        const eqPos = keyEnd;
        const valueStart = eqPos + 1;
        const valueEnd = partEnd;
        
        // Calculate cursor position within this key-value pair
        let keyElement = <span className="text-fofa-cyan">{key.trim()}</span>;
        let eqElement = <span className="text-fofa-gray-300">=</span>;
        let valueElement = <span className="text-fofa-gray-100">{value.trim()}</span>;
        
        // Insert cursor if it's in this part
        if (isCursorInPart) {
          const relativePos = cursorPos - partStart;
          if (relativePos <= key.length) {
            // Cursor is in key
            const beforeCursor = key.slice(0, relativePos);
            const afterCursor = key.slice(relativePos);
            keyElement = (
              <span className="text-fofa-cyan">
                {beforeCursor.trim()}
                <span className="animate-pulse bg-fofa-cyan w-0.5 h-4 inline-block" />
                {afterCursor.trim()}
              </span>
            );
          } else if (relativePos === key.length + 1) {
            // Cursor is after =
            eqElement = (
              <span className="text-fofa-gray-300">
                =
                <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-4 inline-block" />
              </span>
            );
          } else {
            // Cursor is in value
            const valueRelativePos = relativePos - key.length - 1;
            const beforeCursor = value.slice(0, valueRelativePos);
            const afterCursor = value.slice(valueRelativePos);
            valueElement = (
              <span className="text-fofa-gray-100">
                {beforeCursor.trim()}
                <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-4 inline-block" />
                {afterCursor.trim()}
              </span>
            );
          }
        }
        
        formattedPart = (
          <span className="flex items-center">
            {keyElement}
            {eqElement}
            {valueElement}
          </span>
        );
      } else {
        let partElement = <span className="text-fofa-gray-100">{part.trim()}</span>;
        
        if (isCursorInPart) {
          const relativePos = cursorPos - partStart;
          const beforeCursor = part.slice(0, relativePos);
          const afterCursor = part.slice(relativePos);
          partElement = (
            <span className="text-fofa-gray-100">
              {beforeCursor.trim()}
              <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-4 inline-block" />
              {afterCursor.trim()}
            </span>
          );
        }
        
        formattedPart = partElement;
      }
      
      elements.push(
        <Fragment key={index}>
          {formattedPart}
          {index < parts.length - 1 && (
            <span className="text-fofa-gray-400 font-bold">&&</span>
          )}
        </Fragment>
      );
      
      charCount += part.length;
      if (index < parts.length - 1) {
        charCount += 2; // for "&&"
      }
    });
    
    return {
      content: <div className="flex flex-wrap gap-1">{elements}</div>,
      cursorOffset: 0
    };
  };

  useEffect(() => {
    const result = formatInputContent(localQuery, cursorPosition);
    setFormattedContent(result.content);
  }, [localQuery, cursorPosition]);

  useEffect(() => {
    const result = formatInputContent(localQuery, mobileCursorPosition);
    setMobileFormattedContent(result.content);
  }, [localQuery, mobileCursorPosition]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (localQuery.trim()) {
      // Perform the search through context
      await performSearch(localQuery)
      // Navigate to search results page with the query parameter
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`)
      // Close mobile menu if open
      setShowMobileMenu(false)
    }
  }

  const clearSearch = () => {
    setLocalQuery("")
    setQuery("") // Also clear the context query
    setCursorPosition(0)
    setMobileCursorPosition(0)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleMobileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setMobileCursorPosition(e.target.selectionStart || 0);
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleMobileInputClick = () => {
    if (mobileInputRef.current) {
      setMobileCursorPosition(mobileInputRef.current.selectionStart || 0);
    }
  };

  const handleInputKeyUp = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleMobileInputKeyUp = () => {
    if (mobileInputRef.current) {
      setMobileCursorPosition(mobileInputRef.current.selectionStart || 0);
    }
  };

  // Format the key status based on the isvip field
  const keyStatus = accountInfo?.isvip ? "有效" : "无效"

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-fofa-dark/90 backdrop-blur-md text-fofa-gray-100 shadow-md"
      >
        <div className="flex items-center justify-between px-4 py-4">
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
          <form onSubmit={handleSearch} className="hidden md:block relative w-1/2">
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
                  onClick={handleInputClick}
                  onKeyUp={handleInputKeyUp}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full h-11 pl-4 pr-14 ${formattedContent ? 'text-transparent caret-transparent' : 'text-fofa-gray-100'} bg-slate-800/60 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-md text-sm focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none transition-all duration-300`}
                />
                
                {formattedContent && (
                  <div 
                    className="absolute inset-0 pl-4 pr-14 flex items-center text-sm pointer-events-none z-20 overflow-hidden"
                  >
                    {formattedContent}
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
          
          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading || !isLoaded ? (
              <div className="text-fofa-gray-200 text-sm font-medium">
                <Badge variant="outline" className="border-fofa-cyan/40 bg-fofa-dark/80 px-3 py-1 text-fofa-cyan">
                  Loading...
                </Badge>
              </div>
            ) : (
              <>

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
                    onChange={handleMobileInputChange}
                    onClick={handleMobileInputClick}
                    onKeyUp={handleMobileInputKeyUp}
                    onFocus={() => setMobileFocused(true)}
                    onBlur={() => setMobileFocused(false)}
                    className={`w-full h-11 pl-4 pr-14 ${mobileFormattedContent ? 'text-transparent caret-transparent' : 'text-fofa-gray-100'} bg-slate-800/60 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-md text-sm focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none transition-all duration-300`}
                  />
                  
                  {mobileFormattedContent && (
                    <div 
                      className="absolute inset-0 pl-4 pr-14 flex items-center text-sm pointer-events-none z-20 overflow-hidden"
                    >
                      {mobileFormattedContent}
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
            
            {/* Mobile account info - Redesigned */}
            {!isLoading && isLoaded && (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-fofa-gray-200 text-sm font-medium">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-fofa-gray-400 mb-1">剩余可使用量</p>
                    <p className="text-lg text-fofa-cyan font-medium">{accountInfo?.remain_api_query || 0}</p>
                  </div>
                </div>
                <div className="text-fofa-gray-200 text-sm font-medium">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-fofa-gray-400 mb-1">有效期至</p>
                    <p className="text-lg text-fofa-cyan font-medium">{accountInfo?.expiration || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
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
