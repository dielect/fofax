"use client"

import React, { useState, useEffect } from "react"
import { useApiSettings } from "@/lib/context/api-settings-context"
import { DEFAULT_API_BASE_URL, getAccountInfo } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, RotateCcw, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import FofaLogo from "@/components/fofa-logo"

export default function SettingsPage() {
  const { apiUrl, apiKey, setApiUrl, setApiKey, isLoaded } = useApiSettings()
  const router = useRouter()
  
  // Local state for form values
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl)
  const [localApiKey, setLocalApiKey] = useState(apiKey)
  const [isSaved, setIsSaved] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Update local state when context values change and loaded
  useEffect(() => {
    if (isLoaded) {
      setLocalApiUrl(apiUrl)
      setLocalApiKey(apiKey)
    }
  }, [apiUrl, apiKey, isLoaded])

  const handleSave = async () => {
    setIsValidating(true)
    setValidationError("")
    
    try {
      // Validate the API settings
      const result = await getAccountInfo(localApiUrl, localApiKey)
      
      if (result.error) {
        setValidationError(result.message || "API 验证失败，请检查设置")
        setIsValidating(false)
        return
      }
      
      // Save the valid settings
      setApiUrl(localApiUrl || DEFAULT_API_BASE_URL)
      setApiKey(localApiKey || '')
      setIsSaved(true)
      
      // Show success message briefly, then redirect to home page
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      setValidationError("连接API失败，请检查URL和Key")
    } finally {
      setIsValidating(false)
    }
  }

  const handleReset = () => {
    setLocalApiUrl(DEFAULT_API_BASE_URL)
    setLocalApiKey('')
    setValidationError("")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col min-h-screen bg-fofa-dark text-fofa-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-4 bg-fofa-dark/90 backdrop-blur-md text-fofa-gray-100 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-fofa-cyan transition-transform duration-300 hover:scale-105"
          >
            <FofaLogo variant="header" />
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-4xl px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/30 p-8 rounded-lg border border-fofa-cyan/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-fofa-gray-300 hover:text-fofa-cyan transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-semibold text-fofa-gray-100">API 设置</h1>
            </div>
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-green-400 text-sm font-medium flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                设置已保存，正在跳转...
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="api-url" className="text-sm font-medium text-fofa-gray-200 block">
                API 地址
              </label>
              <div className={`relative ${focusedField === 'api-url' ? "gradient-border" : ""}`}>
                <Input
                  id="api-url"
                  placeholder="https://fofa.info/api/v1"
                  value={localApiUrl}
                  onChange={(e) => setLocalApiUrl(e.target.value)}
                  onFocus={() => setFocusedField('api-url')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-slate-700/50 text-fofa-gray-100 border-fofa-cyan/30 w-full focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative"
                />
              </div>
              <p className="text-xs text-fofa-gray-400 mt-1">
                FOFA API 的基础 URL 地址
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium text-fofa-gray-200 block">
                API Key
              </label>
              <div className={`relative ${focusedField === 'api-key' ? "gradient-border" : ""}`}>
                <Input
                  id="api-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="您的 FOFA API Key"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  onFocus={() => setFocusedField('api-key')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-slate-700/50 text-fofa-gray-100 border-fofa-cyan/30 w-full pr-10 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none z-10 relative"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 text-fofa-gray-400 hover:text-fofa-cyan transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-fofa-gray-400 mt-1">
                您的 FOFA API 访问密钥。请确保该密钥保密且不会被公开分享
              </p>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 text-red-400 text-sm py-2 px-3 bg-red-400/10 rounded-md border border-red-400/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{validationError}</p>
              </div>
            )}

            <div className="pt-6 flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="border-fofa-cyan/30 text-fofa-gray-200 hover:text-fofa-cyan hover:bg-slate-700/50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重置为默认
              </Button>
              
              <Button 
                type="button" 
                onClick={handleSave}
                disabled={isValidating || isSaved}
                className="relative overflow-hidden group bg-gradient-to-r from-fofa-cyan to-fofa-cyan-light hover:from-fofa-cyan-light hover:to-fofa-cyan text-fofa-dark disabled:opacity-70 shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                <span className="relative flex items-center">
                  {isValidating ? (
                    <svg className="animate-spin mr-2 h-4 w-4 text-fofa-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isValidating ? "验证中..." : isSaved ? "保存成功" : "保存设置"}
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        .gradient-border::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #00a8ff, #00ff9d, #9d00ff, #00a8ff);
          background-size: 400% 400%;
          z-index: 0;
          border-radius: 0.5rem;
          animation: gradient 3s ease infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
} 