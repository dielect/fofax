"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Default values for API settings
const DEFAULT_API_URL = "https://fofa.xmint.cn/api/v1"
const DEFAULT_API_KEY = ""

interface ApiSettingsContextType {
  apiUrl: string
  apiKey: string
  setApiUrl: (url: string) => void
  setApiKey: (key: string) => void
  isLoaded: boolean
}

const ApiSettingsContext = createContext<ApiSettingsContextType | undefined>(undefined)

export function ApiSettingsProvider({ children }: { children: ReactNode }) {
  // Initialize state with default values
  const [apiUrl, setApiUrlState] = useState<string>(DEFAULT_API_URL)
  const [apiKey, setApiKeyState] = useState<string>(DEFAULT_API_KEY)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const storedApiUrl = localStorage.getItem('fofax_api_url')
        const storedApiKey = localStorage.getItem('fofax_api_key')
        
        if (storedApiUrl) {
          setApiUrlState(storedApiUrl)
        }
        
        if (storedApiKey) {
          setApiKeyState(storedApiKey)
        }
      } catch (error) {
        console.error('Error reading API settings from localStorage:', error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Wrapper functions to update state and localStorage
  const setApiUrl = (url: string) => {
    setApiUrlState(url)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fofax_api_url', url)
      }
    } catch (error) {
      console.error('Error saving API URL to localStorage:', error)
    }
  }

  const setApiKey = (key: string) => {
    setApiKeyState(key)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fofax_api_key', key)
      }
    } catch (error) {
      console.error('Error saving API key to localStorage:', error)
    }
  }

  // Always provide the context, even during initial load
  return (
    <ApiSettingsContext.Provider
      value={{
        apiUrl,
        apiKey,
        setApiUrl,
        setApiKey,
        isLoaded
      }}
    >
      {children}
    </ApiSettingsContext.Provider>
  )
}

export function useApiSettings() {
  const context = useContext(ApiSettingsContext)
  if (context === undefined) {
    throw new Error("useApiSettings must be used within an ApiSettingsProvider")
  }
  return context
} 