import type { Metadata } from "next"

function resolveSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000"

  return rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : `https://${rawUrl}`
}

export const siteUrl = resolveSiteUrl()
export const metadataBase = new URL(siteUrl)

export const companyName = "TradeJournal"
export const shortName = "TradeJournal"
export const siteDescription =
  "TradeJournal — free trading journal for Indian stock market investors. Track your daily P&L, log NIFTY, NSE & BSE trades, and reflect on your trading mindset. Built for intraday traders, F&O traders, and long-term investors."

export const seoKeywords = [
  // Core product
  "trading journal",
  "free trading journal",
  "trade journal app",
  "trading journal India",
  // Indian market specifics
  "NSE trading journal",
  "BSE trading journal",
  "NIFTY trading log",
  "F&O trading journal",
  "options trading journal India",
  "intraday trading journal",
  "intraday P&L tracker",
  "stock market journal India",
  // Trader personas
  "Indian stock trader journal",
  "retail trader journal",
  "Zerodha trade log",
  "Groww trading tracker",
  // Use-case keywords
  "track profit and loss",
  "daily P&L tracker",
  "trade log book",
  "trading mindset journal",
  "trading psychology journal",
  "personal trading tracker",
  "stock trading log",
  "trade performance tracker",
  // Long-tail
  "how to maintain trading journal",
  "best free trading journal for Indian traders",
]

export const sharedOpenGraph = {
  type: "website" as const,
  locale: "en_IN",
  siteName: companyName,
  title: `${companyName} — Free Trading Journal for Indian Investors`,
  description: siteDescription,
}

export const sharedTwitter = {
  card: "summary_large_image" as const,
  title: `${companyName} — Free Trading Journal for Indian Investors`,
  description: siteDescription,
}

export const baseMetadata: Metadata = {
  metadataBase,
  applicationName: companyName,
  title: {
    default: `${companyName} — Free Trading Journal for Indian Investors`,
    template: `%s | ${companyName}`,
  },
  description: siteDescription,
  keywords: seoKeywords,
  authors: [{ name: companyName, url: siteUrl }],
  creator: companyName,
  publisher: companyName,
  category: "finance",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    ...sharedOpenGraph,
    url: "/",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: `${companyName} — Free Trading Journal for Indian Stock Market`,
      },
    ],
  },
  twitter: sharedTwitter,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: shortName,
  },
  formatDetection: {
    telephone: false,
  },
}

export const privateAreaMetadata: Metadata = {
  metadataBase,
  title: {
    default: companyName,
    template: `%s | ${companyName}`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
}
