"use client"

import { SidebarNav } from "@/components/sidebar-nav"

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] flex-col bg-[#0D1B2A] md:flex">
      <SidebarNav />
    </aside>
  )
}