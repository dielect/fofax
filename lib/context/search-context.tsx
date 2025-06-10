"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { searchFofa, DEFAULT_SEARCH_FIELDS } from "@/lib/api"
import type { ResultItemData } from "@/components/result-item"
import { useApiSettings } from "@/lib/context/api-settings-context"

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: ResultItemData[]
  loading: boolean
  error: string | null
  totalResults: number
  uniqueIPs: number
  timeConsumed: number
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  performSearch: (newQuery?: string, newPage?: number, newSize?: number) => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const { apiUrl, apiKey, isLoaded } = useApiSettings()
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<ResultItemData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState<number>(0)
  const [uniqueIPs, setUniqueIPs] = useState<number>(0)
  const [timeConsumed, setTimeConsumed] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Function to transform API results to ResultItemData format
  const transformResults = (apiResults: any[]): ResultItemData[] => {
    return apiResults.map((result, index) => {
      // Create a unique ID for each result
      const id = `result-${index}`;
      
      // Return the result as is since it already matches our ResultItemData structure
      return {
        ...result,
        id
      };
    });
  }

  const performSearch = async (newQuery?: string, newPage?: number, newSize?: number) => {
    const searchQuery = newQuery || query;
    const page = newPage || currentPage;
    const size = newSize || pageSize;
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Start timing the API call
      const startTime = performance.now();
      
      // Execute the search API call with current API settings
      const response = await searchFofa({
        query: searchQuery,
        page,
        size,
        apiUrl,
        apiKey
      });
      
      // End timing and calculate time consumed in milliseconds
      const endTime = performance.now();
      const timeElapsed = Math.round(endTime - startTime);
      
      if (response.error) {
        setError(response.errmsg || "Unknown error occurred");
        setResults([]);
        return;
      }
      
      // Transform API results to our data format
      const transformedResults = transformResults(response.results);
      
      // Update state with search results
      setResults(transformedResults);
      setTotalResults(response.size);
      setUniqueIPs(transformedResults.length); // This is a simplification, should count unique IPs
      setTimeConsumed(timeElapsed); // Set the actual time consumed
      
      // Update current query, page and size if they changed
      if (newQuery) setQuery(newQuery);
      if (newPage) setCurrentPage(newPage);
      if (newSize) setPageSize(newSize);
      
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to perform search. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        results,
        loading,
        error,
        totalResults,
        uniqueIPs,
        timeConsumed,
        currentPage,
        pageSize,
        setCurrentPage,
        setPageSize,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
} 