import type { MetadataRoute } from "next"

import { siteUrl } from "./seo-metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: new Date("2026-08-15"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "en-IN": new URL("/", siteUrl).toString(),
        },
      },
    },
  ]
}
