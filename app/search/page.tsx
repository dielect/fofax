"use client"

import { useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import FofaHeader from "@/components/fofa-header"
import LeftSidebar from "@/components/left-sidebar"
import ResultItem from "@/components/result-item"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Star, Download, LayoutGrid, List, BarChart2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useSearch } from "@/lib/context/search-context"

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "title=\"小红书\""; // Default query from screenshot
  
  // Use the search context
  const {
    query: contextQuery,
    results,
    loading,
    error,
    totalResults,
    uniqueIPs,
    timeConsumed,
    currentPage,
    pageSize,
    performSearch
  } = useSearch();
  
  // Get the current page from URL or default to 1
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  // Get the page size from URL or default to 10
  const urlSize = parseInt(searchParams.get("size") || "10", 10);

  // Keep track of the previous searchParams instance for comparison
  const searchParamsString = searchParams.toString();
  const prevSearchParamsRef = useRef(searchParamsString);
  const initialRenderRef = useRef(true);

  useEffect(() => {
    // Always perform search on initial render or when URL params change
    if (initialRenderRef.current || searchParamsString !== prevSearchParamsRef.current) {
      initialRenderRef.current = false;
      prevSearchParamsRef.current = searchParamsString;
      
      if (query) {
        performSearch(query, urlPage, urlSize);
      }
    }
  }, [searchParamsString, query, urlPage, urlSize, performSearch]);

  // Calculate unique IPs from results
  const uniqueIPCount = results.length > 0 
    ? new Set(results.map(item => item.ip)).size 
    : uniqueIPs;

  // Calculate total pages based on total results and page size
  const totalPages = Math.ceil(totalResults / pageSize);

  // Handle pagination navigation
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) {
      return; // Don't navigate beyond valid page range
    }
    
    // Create a new URLSearchParams object to update the URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    
    // Navigate to the new URL
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100 pt-16">
      {" "}
      {/* pt for fixed header */}
      <FofaHeader initialSearchQuery={query} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between text-sm text-fofa-gray-300 mb-3 p-4 bg-fofa-dark/30 rounded-md border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <span className="text-fofa-cyan font-bold text-lg">{totalResults.toLocaleString()}</span>
                <span className="text-xs text-fofa-gray-400">匹配结果</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <span className="text-fofa-cyan font-bold text-lg">{uniqueIPCount.toLocaleString()}</span>
                <span className="text-xs text-fofa-gray-400">独立 IP</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <span className="text-fofa-cyan font-bold text-lg">{timeConsumed}</span>
                <span className="text-xs text-fofa-gray-400">毫秒</span>
              </div>
            </div>
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-fofa-cyan" />
            </div>
          )}
          {error && (
            <div className="p-4 mx-auto max-w-3xl mt-8 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-center font-medium">{error}</p>
            </div>
          )}
          {!loading && !error && results.length === 0 && (
            <p className="text-fofa-gray-400 text-center py-10">No results found for "{query}".</p>
          )}
          {!loading && !error && results.map((item) => <ResultItem key={item.id || `${item.ip}-${item.port}`} item={item} />)}
          
          {/* Pagination */}
          {!loading && !error && results.length > 0 && (
            <div className="flex justify-center mt-6 mb-8">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1 || loading}
                  className="border-slate-700 text-fofa-gray-300 hover:bg-slate-800"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  上一页
                </Button>
                <span className="px-3 py-1 rounded-md bg-fofa-cyan text-white text-sm">
                  {currentPage}
                </span>
                {totalPages > 0 && (
                  <span className="text-fofa-gray-400 text-xs">
                    / {totalPages}
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={totalPages > 0 && currentPage >= totalPages || loading}
                  className="border-slate-700 text-fofa-gray-300 hover:bg-slate-800"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-fofa-dark">
          <Loader2 className="h-16 w-16 animate-spin text-fofa-cyan" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  )
}
