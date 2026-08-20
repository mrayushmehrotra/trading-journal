"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { IconMenu2 } from "@tabler/icons-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { SidebarNav } from "@/components/sidebar-nav"

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
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 text-foreground md:ml-[248px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-muted md:hidden"
            aria-label="Open navigation menu"
          >
            <IconMenu2 size={20} />
          </button>
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[248px] bg-[#0D1B2A] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main navigation menu</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}