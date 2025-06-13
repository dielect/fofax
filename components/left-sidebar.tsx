"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Filter, Server, Globe, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useSearch } from "@/lib/context/search-context"
import { useMemo } from "react"
import flags from 'emoji-flags'

export default function LeftSidebar() {
  const { results } = useSearch();
  
  // Calculate server distribution
  const serverDistribution = useMemo(() => {
    const servers: Record<string, number> = {};
    
    results.forEach(item => {
      if (item.server) {
        // Extract base server name (e.g. "nginx/1.14.0" -> "nginx")
        const serverName = item.server.split('/')[0];
        servers[serverName] = (servers[serverName] || 0) + 1;
      }
    });
    
    // Sort by count descending
    return Object.entries(servers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [results]);
  
  // Calculate product distribution
  const productDistribution = useMemo(() => {
    const products: Record<string, number> = {};
    
    results.forEach(item => {
      if (item.product && item.product.length) {
        item.product.forEach(prod => {
          products[prod.product] = (products[prod.product] || 0) + 1;
        });
      }
    });
    
    // Sort by count descending
    return Object.entries(products)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [results]);
  
  // Calculate country distribution
  const countryDistribution = useMemo(() => {
    const countries: Record<string, {count: number, code: string, name: string}> = {};
    
    results.forEach(item => {
      if (item.location?.country) {
        const country = item.location.country;
        const countryName = item.location.country_name || country;
        
        if (!countries[country]) {
          countries[country] = {
            count: 0,
            code: country,
            name: countryName
          };
        }
        
        countries[country].count += 1;
      }
    });
    
    // Sort by count descending
    return Object.entries(countries)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([code, data]) => ({
        code,
        name: data.name,
        count: data.count
      }));
  }, [results]);

  // If there are no results, don't render the sidebar
  if (results.length === 0) {
    return null;
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full md:w-64 bg-fofa-dark/50 p-3 md:p-4 space-y-4 md:space-y-6 border-r border-slate-700/50 text-fofa-gray-200 text-sm"
    >
      <div className="space-y-3 md:space-y-4">
        {/* Server distribution card */}
        <div className="bg-slate-800/50 rounded-lg p-2 md:p-3 shadow-md border border-slate-700/50 hover:border-fofa-cyan/30 transition-colors">
          <h3 className="text-xs font-medium text-fofa-gray-300 mb-2 md:mb-3 flex items-center gap-1.5">
            <Server size={14} className="text-fofa-cyan" /> 服务器类型
          </h3>
          <ul className="space-y-1 md:space-y-1.5">
            {serverDistribution.length > 0 ? (
              serverDistribution.map(([server, count]) => (
                <li
                  key={server}
                  className="flex justify-between items-center hover:bg-slate-700/30 px-2 py-1 rounded-md"
                >
                  <Link href="#" className="text-fofa-gray-100 hover:text-fofa-cyan truncate text-xs md:text-sm">
                    {server}
                  </Link>
                  <span className="text-fofa-gray-400 bg-slate-700/50 px-1.5 py-0.5 rounded-md text-xs">{count}</span>
                </li>
              ))
            ) : (
              <li className="text-fofa-gray-400 text-xs italic px-2">No server data available</li>
            )}
          </ul>
        </div>

        {/* Product distribution card */}
        <div className="bg-slate-800/50 rounded-lg p-2 md:p-3 shadow-md border border-slate-700/50 hover:border-fofa-cyan/30 transition-colors">
          <h3 className="text-xs font-medium text-fofa-gray-300 mb-2 md:mb-3 flex items-center gap-1.5">
            <Shield size={14} className="text-fofa-cyan" /> 产品分布
          </h3>
          <ul className="space-y-1 md:space-y-1.5">
            {productDistribution.length > 0 ? (
              productDistribution.map(([product, count]) => (
                <li
                  key={product}
                  className="flex justify-between items-center hover:bg-slate-700/30 px-2 py-1 rounded-md"
                >
                  <Link href="#" className="text-fofa-gray-100 hover:text-fofa-cyan truncate text-xs md:text-sm">
                    {product}
                  </Link>
                  <span className="text-fofa-gray-400 bg-slate-700/50 px-1.5 py-0.5 rounded-md text-xs">{count}</span>
                </li>
              ))
            ) : (
              <li className="text-fofa-gray-400 text-xs italic px-2">No product data available</li>
            )}
          </ul>
        </div>

        {/* Country distribution card */}
        <div className="bg-slate-800/50 rounded-lg p-2 md:p-3 shadow-md border border-slate-700/50 hover:border-fofa-cyan/30 transition-colors">
          <h3 className="text-xs font-medium text-fofa-gray-300 mb-2 md:mb-3 flex items-center gap-1.5">
            <Globe size={14} className="text-fofa-cyan" /> 国家/地区分布
          </h3>
          <ul className="space-y-1 md:space-y-1.5">
            {countryDistribution.length > 0 ? (
              countryDistribution.map((item) => (
                <li
                  key={item.code}
                  className="flex justify-between items-center hover:bg-slate-700/30 px-2 py-1 rounded-md"
                >
                  <Link href="#" className="flex items-center gap-2 text-fofa-gray-100 hover:text-fofa-cyan text-xs md:text-sm">
                    <span className="flex-shrink-0 w-5 flex justify-center">{flags[item.code]?.emoji || item.code}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                  <span className="text-fofa-gray-400 bg-slate-700/50 px-1.5 py-0.5 rounded-md text-xs">{item.count}</span>
                </li>
              ))
            ) : (
              <li className="text-fofa-gray-400 text-xs italic px-2">No location data available</li>
            )}
          </ul>
        </div>
      </div>
    </motion.aside>
  )
}
