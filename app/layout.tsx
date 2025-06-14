import type React from "react";
import type { Metadata } from "next";
import { Mona_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SearchProvider } from "@/lib/context/search-context";
import { ApiSettingsProvider } from "@/lib/context/api-settings-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fofax - 美观隐私的 FOFA 第三方客户端",
  description:
    "Fofax 是一款现代化、注重隐私的 FOFA 第三方客户端。提供精美界面、本地数据存储、无追踪体验，让网络资产搜索更加优雅高效。",
  keywords:
    "FOFA 客户端，FOFA 第三方，网络安全工具，资产搜索，隐私保护，现代界面，网络空间测绘，cybersecurity, fofa client",
  authors: [{ name: "Fofax Team" }],
  creator: "Fofax",
  publisher: "Fofax",
  openGraph: {
    title: "Fofax - 美观隐私的 FOFA 第三方客户端",
    description:
      "现代化的 FOFA 第三方客户端，提供精美界面设计与隐私保护，让网络资产搜索体验更加优雅。API 密钥本地存储，无数据追踪。",
    type: "website",
    locale: "zh_CN",
    siteName: "Fofax",
    images: [
      {
        url: "https://fofax.mianfei.uk/welcome.png",
        width: 1328,
        height: 1328,
        alt: "Fofax - 美观隐私的 FOFA 第三方客户端",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fofax - 美观隐私的 FOFA 第三方客户端",
    description:
      "现代化的 FOFA 第三方客户端，提供精美界面设计与隐私保护，让网络资产搜索体验更加优雅。",
    images: [
      {
        url: "https://fofax.mianfei.uk/welcome.png",
        width: 1328,
        height: 1328,
        alt: "Fofax - 美观隐私的 FOFA 第三方客户端",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "Fofax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ApiSettingsProvider>
            <SearchProvider>{children}</SearchProvider>
          </ApiSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
