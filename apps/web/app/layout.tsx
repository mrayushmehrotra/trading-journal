import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, DM_Sans } from "next/font/google"
import { Toaster } from "sonner"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import QueryProvider from "@/providers/query-provider"
import JotaiProvider from "@/providers/jotai-provider"
import { ClerkProvider } from "@clerk/nextjs"
import {
  baseMetadata,
  companyName,
  siteDescription,
  siteUrl,
} from "./seo-metadata"
import { Analytics } from "@vercel/analytics/next"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = baseMetadata

export const viewport: Viewport = {
  themeColor: "#1A202C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: companyName,
      description: siteDescription,
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#app`,
      name: companyName,
      description: siteDescription,
      url: siteUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "en-IN",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Indian stock market investors and traders",
        geographicArea: {
          "@type": "Country",
          name: "India",
        },
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        geistHeading.variable
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <JotaiProvider>
          <Analytics />
          <QueryProvider>
            <ClerkProvider>
              <ThemeProvider>{children}</ThemeProvider>
              <Toaster position="top-center" richColors />
            </ClerkProvider>
          </QueryProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
