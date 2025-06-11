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
  title: "FoFaX - Security Search Engine",
  description:
    "Advanced security search platform for network assets and vulnerabilities",
  keywords:
    "security, search engine, network assets, vulnerabilities, cybersecurity",
  authors: [{ name: "FoFaX Team" }],
  creator: "FoFaX",
  publisher: "FoFaX",
  openGraph: {
    title: "FoFaX - Security Search Engine",
    description:
      "Advanced security search platform for network assets and vulnerabilities",
    type: "website",
    locale: "en_US",
    siteName: "FoFaX",
    images: [
      {
        url: "https://fofax.mianfei.uk/welcome.png",
        width: 1200,
        height: 675,
        alt: "FoFaX - Security Search Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoFaX - Security Search Engine",
    description:
      "Advanced security search platform for network assets and vulnerabilities",
    images: [
      {
        url: "https://fofax.mianfei.uk/welcome.png",
        width: 1200,
        height: 675,
        alt: "FoFaX - Security Search Engine",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "FoFaX",
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
