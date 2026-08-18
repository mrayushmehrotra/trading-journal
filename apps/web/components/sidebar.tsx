"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconLayoutDashboard,
  IconTrendingUp,
  IconBook2,
  IconCalendar,
  IconUserCircle,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import { staggerContainer, fadeInLeft } from "@/lib/animation-variants"
import { authClient } from "@/lib/auth/client"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Trades", href: "/trades", icon: IconTrendingUp },
  { label: "Journal", href: "/journal", icon: IconBook2 },
  { label: "Calendar", href: "/calendar", icon: IconCalendar },
  { label: "Account", href: "/account", icon: IconUserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const fullName = user?.name || "Loading..."
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??"

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[#0D1B2A]">
      <motion.div
        className="flex items-center gap-3 border-b border-white/10 px-6 py-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#22C55E]/30 bg-[#0D1B2A] shadow-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            delay: 0.1,
          }}
        >
          <Image
            src="/icon.png"
            alt="TradeJournal Logo"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div>
          <p className="text-sm leading-none font-bold text-white">TradeJournal</p>
          <p className="mt-0.5 text-[10px] text-[#B8C4CC]">Daily P/L & Journal</p>
        </div>
      </motion.div>

      <motion.nav
        className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <motion.div key={href} variants={fadeInLeft}>
              <Link
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-[#B8C4CC] hover:bg-white/5 hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-[#1A7A4A]"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <Icon
                  size={18}
                  stroke={1.8}
                  className={cn(
                    "z-10 shrink-0 transition-colors",
                    active
                      ? "text-white"
                      : "text-[#8A9BA8] group-hover:text-white"
                  )}
                />
                <span className="z-10 flex-1 truncate">{label}</span>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <IconChevronRight
                      size={14}
                      className="z-10 shrink-0 text-white/60"
                    />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>

      <motion.div
        className="border-t border-white/10 px-4 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/20">
            <span className="text-xs font-bold text-[#22C55E]">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{fullName}</p>
            <p className="truncate text-[11px] text-[#8A9BA8]">{user?.email || "..."}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-[#8A9BA8] transition-colors hover:bg-white/5 hover:text-[#EF4444]"
            title="Logout"
          >
            <IconLogout size={18} stroke={1.8} />
          </button>
        </div>
      </motion.div>
    </aside>
  )
}