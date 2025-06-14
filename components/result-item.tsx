"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Code, Box, RefreshCw, PlusCircle, Globe, Server, ExternalLink, Lock, Copy, Check, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"
import flags from 'emoji-flags'
import React from "react"

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
  header_hash?: string
  cert?: {
    cert: string
    domain?: string[]
    issuer?: {
      cn?: string
      org?: string
    }
    not_after?: string
    not_before?: string
    sn?: string
    subject?: {
      cn?: string
      org?: string
    }
  }
  banner?: string
  updated_at?: string
  lastupdatetime?: string
  tls?: {
    ja3s?: string
    version?: string
  }
  product?: Array<{
    product: string
    version?: string
    category?: string
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
  
  // State for copy success animation
  const [isCopied, setIsCopied] = React.useState(false);
  
  // Function to copy IP to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  // Group products by category
  const groupedProducts = React.useMemo(() => {
    if (!item.product || item.product.length === 0) return {};
    
    return item.product.reduce((acc, prod) => {
      const category = prod.category || '其他';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(prod);
      return acc;
    }, {} as Record<string, Array<{ product: string; version?: string; category?: string }>>);
  }, [item.product]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/30 rounded-lg shadow-lg overflow-hidden border border-slate-700/50"
    >
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            <Link2 size={18} className="text-fofa-cyan flex-shrink-0 mt-1" />
            <div className="flex flex-col min-w-0 flex-1">
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
          <div className="flex items-center gap-1 flex-shrink-0 self-start">
            {item.protocol && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-2 py-1">
                {item.protocol.toUpperCase()}
              </Badge>
            )}
            <Badge className="bg-blue-600 text-white text-xs">{item.port}</Badge>
          </div>
        </div>

        <h3 className="text-md text-fofa-gray-100 truncate">{item.title || 'No title'}</h3>
        
        <div className="space-y-2">
          {/* First row: IP with copy button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-fofa-gray-400">
              <span className="text-fofa-gray-200 font-mono">{item.ip}</span>
              <motion.button
                onClick={() => copyToClipboard(item.ip)}
                className={`p-1 rounded transition-all duration-200 ${
                  isCopied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'hover:bg-slate-700/50 text-fofa-gray-400 hover:text-fofa-cyan'
                }`}
                title={isCopied ? "Copied!" : "Copy IP"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isCopied ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ 
                    scale: isCopied ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCopied ? (
                    <Check size={12} />
                  ) : (
                    <Copy size={12} />
                  )}
                </motion.div>
              </motion.button>
              
              {isCopied && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs text-green-400 font-medium"
                >
                  已复制
                </motion.span>
              )}
            </div>
            

          </div>

          {/* Second row: Location and ASN */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fofa-gray-400">
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
          </div>

          {/* Third row: Organization */}
          {item.org && (
            <div className="flex items-center gap-1 text-xs text-fofa-gray-400">
              <span className="whitespace-nowrap">组织：</span>
              <span className="text-fofa-gray-200 truncate">{item.org}</span>
            </div>
          )}

          {/* ICP row */}
          {item.icp && (
            <div className="flex items-center gap-1 text-xs text-fofa-gray-400">
              <span className="whitespace-nowrap">ICP备案：</span>
              <span className="text-fofa-gray-200 truncate">{item.icp}</span>
            </div>
          )}



          {/* Fourth row: Certificate (if available) */}
          {item.cert && item.port === 443 && (
            <div className="flex items-center gap-2 text-xs">
              <Lock size={14} className="text-green-400 flex-shrink-0" />
              <div className="flex items-center gap-1 text-fofa-gray-400">
                <span>证书：</span>
                <span className="text-fofa-gray-200 truncate max-w-[150px]">
                  {item.cert.subject?.cn || item.cert.domain?.[0] || 'SSL Certificate'}
                </span>
                {item.cert.issuer?.org && (
                  <span className="text-fofa-gray-400 text-xs">
                    ({item.cert.issuer.org})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* JARM指纹 */}
          {item.jarm && (
            <div className="flex items-center gap-1 text-xs text-fofa-gray-400">
              <span className="whitespace-nowrap">JARM指纹：</span>
              <span className="text-emerald-400 font-mono truncate max-w-[120px] md:max-w-none md:truncate-none break-all">{item.jarm}</span>
            </div>
          )}

          {/* TLS information */}
          {item.tls && (item.tls.version || item.tls.ja3s) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fofa-gray-400">
              {item.tls.version && (
                <div className="flex items-center gap-1">
                  <span>TLS版本：</span>
                  <span className="text-fofa-gray-200">{item.tls.version}</span>
                </div>
              )}
              {item.tls.ja3s && (
                <div className="flex items-center gap-1">
                  <span>JA3S指纹：</span>
                  <span className="text-fofa-gray-200 font-mono truncate max-w-[120px]">{item.tls.ja3s}</span>
                </div>
              )}
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
        <TabsList className={`grid w-full ${item.cert && item.port === 443 ? 'grid-cols-3' : 'grid-cols-2'} bg-slate-800/50 rounded-none`}>
          <TabsTrigger value="header" className="data-[state=active]:bg-slate-700 data-[state=active]:text-fofa-cyan">
            Header
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-slate-700 data-[state=active]:text-fofa-cyan">
            Products
          </TabsTrigger>
          {item.cert && item.port === 443 && (
            <TabsTrigger value="certificate" className="data-[state=active]:bg-slate-700 data-[state=active]:text-fofa-cyan">
              Certificate
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="header" className="p-3 md:p-4 bg-slate-900/30 text-xs text-fofa-gray-300 leading-relaxed">
          <div className="relative">
            <pre className="whitespace-pre-wrap break-all max-h-[200px] overflow-y-scroll scrollbar-hide">
              {item.header || 'No header information available'}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="products" className="p-3 md:p-4 bg-slate-900/30 text-xs text-fofa-gray-300">
          {item.product && item.product.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-fofa-gray-100 uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="flex-1 h-px bg-slate-700/50"></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {products.map((prod, index) => (
                      <div 
                        key={`${category}-${index}`}
                        className="group inline-flex items-center gap-2 px-3 py-2 bg-slate-800/40 rounded-full border border-slate-700/30 hover:border-fofa-cyan/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer"
                      >
                        <span className="text-sm font-medium text-fofa-cyan group-hover:text-fofa-cyan/80 transition-colors whitespace-nowrap">
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
        {item.cert && item.port === 443 && (
          <TabsContent value="certificate" className="p-3 md:p-4 bg-slate-900/30 text-xs text-fofa-gray-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-green-400 flex-shrink-0" />
                <h4 className="text-sm font-semibold text-fofa-cyan">SSL Certificate</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.cert.subject?.cn && (
                  <div>
                    <span className="text-fofa-gray-400 block mb-1">Subject:</span>
                    <span className="text-fofa-gray-100 font-mono text-sm">{item.cert.subject.cn}</span>
                  </div>
                )}
                
                {item.cert.issuer?.org && (
                  <div>
                    <span className="text-fofa-gray-400 block mb-1">Issuer:</span>
                    <span className="text-fofa-gray-100 font-mono text-sm">{item.cert.issuer.org}</span>
                    {item.cert.issuer.cn && (
                      <span className="text-fofa-gray-300 font-mono text-xs block">({item.cert.issuer.cn})</span>
                    )}
                  </div>
                )}
                
                {item.cert.not_before && (
                  <div>
                    <span className="text-fofa-gray-400 block mb-1">Valid From:</span>
                    <span className="text-fofa-gray-100 font-mono text-sm">{item.cert.not_before}</span>
                  </div>
                )}
                
                {item.cert.not_after && (
                  <div>
                    <span className="text-fofa-gray-400 block mb-1">Valid Until:</span>
                    <span className="text-fofa-gray-100 font-mono text-sm">{item.cert.not_after}</span>
                  </div>
                )}
                
                {item.cert.sn && (
                  <div className="md:col-span-2">
                    <span className="text-fofa-gray-400 block mb-1">Serial Number:</span>
                    <span className="text-fofa-gray-100 font-mono text-sm break-all">{item.cert.sn}</span>
                  </div>
                )}
                
                {item.cert.domain && item.cert.domain.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="text-fofa-gray-400 block mb-1">Domain Names:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.cert.domain.map((domain, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs border-fofa-cyan/40 text-fofa-cyan/80 bg-fofa-cyan/10"
                        >
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {item.cert.cert && (
                <div className="mt-6">
                  <span className="text-fofa-gray-400 block mb-2">Certificate Details:</span>
                  <pre className="whitespace-pre-wrap break-all max-h-[300px] overflow-y-scroll bg-slate-800/50 p-3 rounded text-xs scrollbar-hide">
                    {item.cert.cert}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="p-2 md:p-3 bg-slate-800/30 border-t border-slate-700/50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
          {/* Display any additional tags */}
          {item.header_hash && (
            <div className="flex items-center gap-1 text-xs">
              <span className="whitespace-nowrap text-fofa-cyan/80">Header Hash：</span>
              <span className="text-fofa-cyan/80 font-mono truncate max-w-[120px] md:max-w-[200px]" title={item.header_hash}>
                {item.header_hash.length > 12 ? `${item.header_hash.substring(0, 12)}...` : item.header_hash}
              </span>
            </div>
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
        
        {/* Time information in bottom right */}
        {(item.lastupdatetime || item.updated_at) && (
          <div className="flex items-center gap-1 text-xs text-fofa-gray-400 ml-auto">
            <span>更新时间：</span>
            <span className="text-fofa-gray-300 font-mono">{item.lastupdatetime || item.updated_at}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
