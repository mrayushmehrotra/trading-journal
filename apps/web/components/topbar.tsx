"use client"

import { usePathname } from "next/navigation"
import { UserButton } from "@neondatabase/auth-ui"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/trades": "Trades",
  "/journal": "Journal",
  "/account": "Account",
}

export function Topbar() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "TradeJournal"

  return (
    <header className="fixed inset-x-0 top-0 z-40 ml-[248px] flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 text-foreground">
      <h1 className="text-lg font-semibold">{title}</h1>
      <UserButton />
    </header>

  )
}