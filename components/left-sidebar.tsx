"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Filter } from "lucide-react"
import { motion } from "framer-motion"

const fingerprintData = [
  { name: "bOOlp...", count: 1455 },
  { name: "oC37L...", count: 919 },
  { name: "G1ye...", count: 580 },
  { name: "CToVV...", count: 459 },
  { name: "1TDvy...", count: 408 },
]

const countryData = [
  { name: "美国", flag: "/flags/us.png", count: 4726 },
  { name: "中国", flag: "/flags/cn.png", count: 3443 },
  { name: "中国香港", flag: "/flags/hk.png", count: 3324 },
  { name: "南非", flag: "/flags/za.png", count: 507 },
  { name: "新加坡", flag: "/flags/sg.png", count: 135 },
]

export default function LeftSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-64 bg-fofa-dark/50 p-4 space-y-6 border-r border-slate-700/50 text-fofa-gray-200 text-sm"
    >
      <div>
        <h3 className="text-xs text-fofa-gray-400 mb-2 flex items-center gap-1">
          <Filter size={14} /> 网站指纹排名
        </h3>
        <ul className="space-y-1">
          {fingerprintData.map((item) => (
            <li
              key={item.name}
              className="flex justify-between items-center hover:bg-slate-700/30 px-2 py-1 rounded-md"
            >
              <Link href="#" className="text-fofa-cyan hover:underline truncate">
                {item.name}
              </Link>
              <span className="text-fofa-gray-400">{item.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs text-fofa-gray-400 mb-2">国家/地区排名</h3>
        <ul className="space-y-1">
          {countryData.map((item) => (
            <li
              key={item.name}
              className="flex justify-between items-center hover:bg-slate-700/30 px-2 py-1 rounded-md"
            >
              <Link href="#" className="flex items-center gap-2 text-fofa-gray-100 hover:text-fofa-cyan">
                <ChevronRight size={14} className="text-fofa-cyan" />
                <Image
                  src={item.flag || "/placeholder.svg"}
                  alt={item.name}
                  width={16}
                  height={12}
                  className="rounded-sm"
                />
                <span className="truncate">{item.name}</span>
              </Link>
              <span className="text-fofa-gray-400">{item.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4">
        <Image src="/world-map-placeholder.png" alt="World map" width={220} height={110} className="opacity-70" />
      </div>
    </motion.aside>
  )
}
