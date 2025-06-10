"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Code, Box, RefreshCw, PlusCircle } from "lucide-react"
import { motion } from "framer-motion"

export interface ResultItemData {
  id: string
  url: string
  ip: string
  port: number
  title: string
  location: {
    country: string
    region: string
    city: string
    flag: string
  }
  asn: string
  organization: string
  date: string
  tech: string[]
  httpHeaders: string
  products?: string[] // Optional
  certificateInfo?: string // Optional
  tags: string[]
}

interface ResultItemProps {
  item: ResultItemData
}

export default function ResultItem({ item }: ResultItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/30 rounded-lg shadow-lg overflow-hidden border border-slate-700/50"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-fofa-cyan" />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-fofa-cyan hover:underline truncate"
            >
              {item.url}
            </a>
            <Badge variant="outline" className="text-xs border-blue-500 text-blue-400 ml-1">
              MCO... {/* Placeholder */}
            </Badge>
          </div>
          <Badge className="bg-blue-600 text-white text-xs">{item.port}</Badge>
        </div>

        <h3 className="text-md text-fofa-gray-100 mb-1 truncate">{item.title}</h3>
        <p className="text-xs text-fofa-gray-400 mb-1">{item.ip}</p>
        <div className="flex items-center gap-2 text-xs text-fofa-gray-300 mb-2">
          <Image src={item.location.flag || "/placeholder.svg"} alt={item.location.country} width={16} height={12} />
          <span>
            {item.location.country} / {item.location.region} / {item.location.city}
          </span>
        </div>

        <div className="text-xs text-fofa-gray-400 space-y-0.5 mb-2">
          <p>
            ASN: <span className="text-fofa-gray-200">{item.asn}</span>
          </p>
          <p>
            组织: <span className="text-fofa-gray-200 truncate">{item.organization}</span>
          </p>
          <p>
            日期: <span className="text-fofa-gray-200">{item.date}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {item.tech.map((techName) => (
            <Badge
              key={techName}
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
            >
              {techName === "nginx" && (
                <Image src="/tech-icons/nginx.png" alt="nginx" width={12} height={12} className="mr-1 inline" />
              )}
              {techName}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 text-fofa-gray-400">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-fofa-cyan">
            <Code size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-fofa-cyan">
            <Box size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-fofa-cyan">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="header" className="w-full text-sm">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 rounded-none">
          <TabsTrigger value="header" className="data-[state=active]:bg-slate-700 data-[state=active]:text-fofa-cyan">
            Header
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-slate-700 data-[state=active]:text-fofa-cyan">
            Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="header" className="p-4 bg-slate-900/30 text-xs text-fofa-gray-300 leading-relaxed">
          <pre className="whitespace-pre-wrap break-all">{item.httpHeaders}</pre>
          {item.certificateInfo && (
            <Button variant="link" className="text-fofa-cyan p-0 h-auto mt-2 text-xs hover:underline">
              <PlusCircle size={14} className="mr-1" /> Certificate
            </Button>
          )}
        </TabsContent>
        <TabsContent value="products" className="p-4 bg-slate-900/30 text-xs text-fofa-gray-300">
          {item.products && item.products.length > 0 ? (
            <ul>
              {item.products.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p>No products listed.</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="p-3 bg-slate-800/30 border-t border-slate-700/50 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs border-fofa-cyan/50 text-fofa-cyan/80">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  )
}
