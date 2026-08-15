import type { MetadataRoute } from "next"

import { siteUrl } from "./seo-metadata"

const privatePaths = [
  "/dashboard",
  "/trades",
  "/journal",
  "/account",
  "/auth",
  "/api",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  }
}
