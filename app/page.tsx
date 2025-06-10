"use client"

import { type ReactNode, type FormEvent, type ChangeEvent } from "react"
import { Fragment, useMemo } from "react"

import FofaLogo from "@/components/fofa-logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setCursorPosition(0)
  }

  const formatInputContent = (value: string, cursorPos: number, showCursor: boolean = true) => {
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
        
        // Insert cursor if it's in this part and should show cursor
        if (isCursorInPart && showCursor) {
          const relativePos = cursorPos - partStart;
          if (relativePos <= key.length) {
            // Cursor is in key
            const beforeCursor = key.slice(0, relativePos);
            const afterCursor = key.slice(relativePos);
            keyElement = (
              <span className="text-fofa-cyan">
                {beforeCursor.trim()}
                <span className="animate-pulse bg-fofa-cyan w-0.5 h-5 inline-block" />
                {afterCursor.trim()}
              </span>
            );
          } else if (relativePos === key.length + 1) {
            // Cursor is after =
            eqElement = (
              <span className="text-fofa-gray-300">
                =
                <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-5 inline-block" />
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
                <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-5 inline-block" />
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
        
        if (isCursorInPart && showCursor) {
          const relativePos = cursorPos - partStart;
          const beforeCursor = part.slice(0, relativePos);
          const afterCursor = part.slice(relativePos);
          partElement = (
            <span className="text-fofa-gray-100">
              {beforeCursor.trim()}
              <span className="animate-pulse bg-fofa-gray-100 w-0.5 h-5 inline-block" />
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

  const formattedContent = useMemo(() => {
    const result = formatInputContent(searchQuery, cursorPosition, isFocused);
    return result.content;
  }, [searchQuery, cursorPosition, isFocused]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleInputKeyUp = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100 overflow-hidden">
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
                onClick={handleInputClick}
                onKeyUp={handleInputKeyUp}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full h-14 pl-5 ${formattedContent ? 'text-transparent caret-transparent' : 'text-fofa-gray-100'} pr-28 py-3 text-lg bg-slate-800/50 border-2 border-fofa-cyan/30 focus-visible:border-transparent focus-visible:ring-0 placeholder-fofa-gray-400 rounded-lg focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative [&::-webkit-search-cancel-button]:appearance-none`}
              />
              
              {formattedContent && (
                <div 
                  className="absolute inset-0 pl-5 pr-28 flex items-center text-lg pointer-events-none z-20 overflow-hidden"
                >
                  {formattedContent}
                </div>
              )}
              
              {searchQuery && (
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
                className="text-fofa-cyan hover:text-fofa-cyan-light transition-colors p-2 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:bg-transparent"
              >
                <Search className="w-6 h-6" />
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
