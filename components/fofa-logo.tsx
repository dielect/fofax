"use client"

import { Search } from "lucide-react"
import { motion } from "framer-motion"

type FofaLogoProps = {
  variant?: "default" | "header"
}

export default function FofaLogo({ variant = "default" }: FofaLogoProps) {
  // Default styling for the main page
  const defaultClassNames = "flex items-center justify-center text-8xl md:text-9xl font-bold text-fofa-cyan select-none"
  
  // Smaller styling for header use
  const headerClassNames = "flex items-center justify-center text-3xl font-bold text-fofa-cyan select-none"
  
  const className = variant === "header" ? headerClassNames : defaultClassNames
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <span>F</span>
      <div className="relative mx-1 w-[1em] h-[1em] flex items-center justify-center">
        <Search className="absolute w-[0.8em] h-[0.8em] text-fofa-cyan" strokeWidth={2.5} />
        {/* Simplified 'O' as magnifying glass */}
        <div className="absolute w-[0.5em] h-[0.5em] rounded-full bg-fofa-blue opacity-50"></div>
      </div>
      <span>F</span>
      <span>A</span>
    </motion.div>
  )
}
