"use client"

import { Search } from "lucide-react"
import { motion } from "framer-motion"

export default function FofaLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-center text-8xl md:text-9xl font-bold text-fofa-cyan select-none"
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
