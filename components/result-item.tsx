"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Code, Box, RefreshCw, PlusCircle, Globe, Server, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import flags from 'emoji-flags'

export interface ResultItemData {
  host?: string
  ip: string
  port: number
  protocol?: string
  location?: {
    country?: string
    country_name?: string
    region?: string
    city?: string
  }
  title?: string
  domain?: string
  server?: string
  icp?: string
  asn?: number | string
  org?: string
  os?: string[]
  jarm?: string
  header?: string
  cert?: {
    cert: string
  }
  banner?: string
  updated_at?: string
  product?: Array<{
    product: string
    version?: string
  }>
  version?: string
  icon_hash?: string
  fid?: string
  structinfo?: string
  // Custom field for the UI
  id?: string
}

interface ResultItemProps {
  item: ResultItemData
}

export default function ResultItem({ item }: ResultItemProps) {
  // Create a URL from host or IP+port
  const url = item.host || `${item.protocol || 'http'}://${item.ip}:${item.port}`;
  const locationAvailable = item.location && (item.location.country_name || item.location.country || item.location.region || item.location.city);
  
  // Generate a unique ID if not provided
  const id = item.id || `${item.ip}-${item.port}`;
  
  // Format URL for display - truncate if too long
  const displayUrl = url.length > 40 ? `${url.substring(0, 37)}...` : url;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/30 rounded-lg shadow-lg overflow-hidden border border-slate-700/50"
    >
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-2 max-w-[calc(100%-60px)] overflow-hidden">
            <Link2 size={18} className="text-fofa-cyan flex-shrink-0 mt-1" />
            <div className="flex flex-col min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-md md:text-lg font-semibold text-fofa-cyan hover:underline truncate flex items-center gap-1"
              >
                {displayUrl}
                <ExternalLink size={14} className="flex-shrink-0" />
              </a>
            </div>
          </div>
          <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">{item.port}</Badge>
        </div>

        <h3 className="text-md text-fofa-gray-100 truncate">{item.title || 'No title'}</h3>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-fofa-gray-400">
          <p>{item.ip}</p>
          
          {locationAvailable && (
            <div className="flex items-center gap-2 text-fofa-gray-300">
              {item.location?.country && (
                <span className="text-base">
                  {flags[item.location.country]?.emoji || item.location.country}
                </span>
              )}
              <span className="truncate max-w-[180px]">
                {[
                  item.location?.country_name || item.location?.country, 
                  item.location?.region, 
                  item.location?.city
                ]
                  .filter(Boolean)
                  .join(' / ')}
              </span>
            </div>
          )}

          {item.asn && (
            <div className="flex items-center gap-1">
              <span className="text-fofa-gray-400">ASN:</span>
              <span className="text-fofa-gray-200">{item.asn}</span>
            </div>
          )}
          
          {item.org && (
            <div className="flex items-center gap-1 max-w-[200px] md:max-w-[300px]">
              <span className="text-fofa-gray-400 whitespace-nowrap">组织：</span>
              <span className="text-fofa-gray-200 truncate">{item.org}</span>
            </div>
          )}
          
          {item.updated_at && (
            <div className="flex items-center gap-1">
              <span className="text-fofa-gray-400">日期：</span>
              <span className="text-fofa-gray-200">{item.updated_at}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {item.server && (
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 md:px-3 py-1 tracking-wide"
            >
              <Server size={12} className="mr-1 hidden sm:inline-block" />
              <span className="tracking-widest">{item.server}</span>
            </Badge>
          )}
          {item.os && item.os.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 md:px-3 py-1 tracking-wide"
            >
              <span className="tracking-widest truncate max-w-[120px] md:max-w-full">{item.os.join(", ")}</span>
            </Badge>
          )}
          {item.protocol && (
            <Badge
              variant="secondary"
              className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-2 md:px-3 py-1 tracking-wide"
            >
              <span className="tracking-widest">{item.protocol}</span>
            </Badge>
          )}
          {item.version && (
            <Badge
              variant="secondary"
              className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs px-2 md:px-3 py-1 tracking-wide"
            >
              <span className="tracking-widest">{item.version}</span>
            </Badge>
          )}
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
        <TabsContent value="header" className="p-3 md:p-4 bg-slate-900/30 text-xs text-fofa-gray-300 leading-relaxed">
          <pre className="whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">{item.header || 'No header information available'}</pre>
        </TabsContent>
        <TabsContent value="products" className="p-3 md:p-4 bg-slate-900/30 text-xs text-fofa-gray-300">
          {item.product && item.product.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.product.map((prod, index) => (
                <div 
                  key={index} 
                  className="group inline-flex items-center gap-2 px-3 py-2 bg-slate-800/40 rounded-full border border-slate-700/30 hover:border-fofa-cyan/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 bg-fofa-cyan rounded-full flex-shrink-0 group-hover:bg-fofa-cyan/80 transition-colors"></div>
                  <span className="text-sm font-medium text-fofa-gray-100 group-hover:text-fofa-cyan transition-colors whitespace-nowrap">
                    {prod.product}
                  </span>
                  {prod.version && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-fofa-cyan/40 text-fofa-cyan/80 bg-fofa-cyan/10 group-hover:border-fofa-cyan/60 transition-colors px-2 py-0.5 h-5"
                    >
                      {prod.version}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Box className="w-8 h-8 text-fofa-gray-500 mb-2" />
              <p className="text-fofa-gray-400">No product information available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="p-2 md:p-3 bg-slate-800/30 border-t border-slate-700/50 flex flex-wrap gap-2">
        {/* Display any additional tags */}
        {item.jarm && (
          <Badge variant="outline" className="text-xs border-fofa-cyan/50 text-fofa-cyan/80">
            JARM: {item.jarm.substring(0, 6)}...
          </Badge>
        )}
        {item.icon_hash && (
          <Badge variant="outline" className="text-xs border-fofa-cyan/50 text-fofa-cyan/80">
            Icon: {item.icon_hash.substring(0, 6)}...
          </Badge>
        )}
        {item.fid && (
          <Badge variant="outline" className="text-xs border-fofa-cyan/50 text-fofa-cyan/80">
            FID: {item.fid.substring(0, 6)}...
          </Badge>
        )}
      </div>
    </motion.div>
  )
}
