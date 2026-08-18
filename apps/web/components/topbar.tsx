"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/trades": "Trades",
  "/journal": "Journal",
  "/calendar": "Calendar Heatmap",
  "/account": "Account",
}

export function Topbar() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "TradeJournal"

  return (
    <header className="fixed inset-x-0 top-0 z-40 ml-[248px] flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 text-foreground">
      <div className="flex items-center gap-3">
        <Image
          src="/icon.png"
          alt="TradeJournal Logo"
          width={28}
          height={28}
          className="rounded-lg border border-[#22C55E]/30 shadow-sm"
        />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <UserButton />
    </header>
  )
}