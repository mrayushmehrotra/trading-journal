import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/server"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { PnLChart } from "@/components/pnl-chart"
import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPlus,
  IconBook2,
  IconBrain,
  IconFlame,
  IconSparkles,
  IconAlertCircle,
  IconChevronRight,
} from "@tabler/icons-react"
import { privateAreaMetadata } from "@/app/seo-metadata"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  ...privateAreaMetadata,
  title: "Dashboard",
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function DashboardPage() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return null

  const [trades, journalEntries] = await Promise.all([
    prisma.trade.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
    }),
    prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 4,
    }),
  ])

  const userName = session.user.name
    ? session.user.name.split(" ")[0]
    : "Trader"
  const today = new Date().toISOString().slice(0, 10)
  const todayTrade = trades.find(
    (t) => t.date.toISOString().slice(0, 10) === today
  )

  const totalPnl = trades.reduce((sum, t) => sum + Number(t.pnl), 0)
  const profitableDays = trades.filter((t) => Number(t.pnl) > 0).length
  const winRate = trades.length > 0 ? (profitableDays / trades.length) * 100 : 0
  const bestDay = trades.reduce<{ pnl: number; date: Date | null }>(
    (best, t) =>
      Number(t.pnl) > best.pnl ? { pnl: Number(t.pnl), date: t.date } : best,
    { pnl: -Infinity, date: null }
  )
  const worstDay = trades.reduce<{ pnl: number; date: Date | null }>(
    (worst, t) =>
      Number(t.pnl) < worst.pnl ? { pnl: Number(t.pnl), date: t.date } : worst,
    { pnl: Infinity, date: null }
  )

  const chartData = trades.map((t, index) => ({
    date: t.date.toISOString().slice(0, 10),
    pnl: Number(t.pnl),
    cumulative: trades
      .slice(0, index + 1)
      .reduce((sum, prev) => sum + Number(prev.pnl), 0),
  }))

  const stats = [
    {
      label: "Today's P/L",
      value: todayTrade ? currency.format(Number(todayTrade.pnl)) : "—",
      positive: todayTrade ? Number(todayTrade.pnl) >= 0 : null,
      icon:
        todayTrade && Number(todayTrade.pnl) < 0
          ? IconArrowDownRight
          : IconArrowUpRight,
      subtext: todayTrade ? "Trade logged today" : "No trade logged today",
    },
    {
      label: "Total Cumulative P/L",
      value: currency.format(totalPnl),
      positive: totalPnl >= 0,
      icon: totalPnl >= 0 ? IconArrowUpRight : IconArrowDownRight,
      subtext: `${trades.length} total trade days`,
    },
    {
      label: "Win Rate",
      value: trades.length > 0 ? `${winRate.toFixed(1)}%` : "—",
      positive: winRate >= 50,
      icon: IconTrendingUp,
      subtext: `${profitableDays} profitable / ${trades.length} days`,
    },
    {
      label: "Best Day",
      value: bestDay.date ? currency.format(bestDay.pnl) : "—",
      positive: true,
      icon: IconTrendingUp,
      subtext: bestDay.date ? formatDate(bestDay.date) : "No data",
    },
    {
      label: "Worst Day",
      value: worstDay.date ? currency.format(worstDay.pnl) : "—",
      positive: false,
      icon: IconTrendingDown,
      subtext: worstDay.date ? formatDate(worstDay.date) : "No data",
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header & Quick Action Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575]/15 px-3 py-1 text-xs font-semibold text-[#00E575] dark:text-[#00E575]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00E575]" />
              NSE &amp; BSE Live
            </span>
            <span className="text-xs text-muted-foreground">Market Status</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your daily trading performance summary and journal
            insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
          <Link
            href="/trades"
            className="inline-flex items-center gap-2 rounded-full bg-[#00E575] px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-md shadow-[#00E575]/20 transition hover:bg-[#00D66C] active:scale-95"
          >
            <IconPlus size={18} stroke={2.5} />
            <span>Log Trade</span>
          </Link>
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <IconBook2 size={18} />
            <span>Write Journal</span>
          </Link>
        </div>
      </div>

      {/* Streak / Motivation Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-[#00E575]/30 bg-[#00E575]/10 px-6 py-4 text-sm text-[#0F172A] dark:text-emerald-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E575] text-[#0F172A] shadow-sm">
            <IconFlame size={20} />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Consistency is the #1 Key to Profitability
            </p>
            <p className="text-xs text-muted-foreground">
              Keep logging daily P&amp;L and reflecting on your trade execution
              mindset.
            </p>
          </div>
        </div>
        <Link
          href="/journal"
          className="hidden items-center gap-1 text-xs font-semibold text-[#00E575] hover:underline sm:inline-flex"
        >
          <span>Write entry</span>
          <IconChevronRight size={14} />
        </Link>
      </div>

      {/* 5 Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, positive, icon: Icon, subtext }) => (
          <Card
            key={label}
            className={`border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              positive === true
                ? "hover:border-emerald-500/40"
                : positive === false
                  ? "hover:border-rose-500/40"
                  : "hover:border-border"
            }`}
          >
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {label}
              </CardTitle>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  positive === null
                    ? "bg-muted text-muted-foreground"
                    : positive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                <Icon size={16} stroke={2} />
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  positive === null
                    ? "text-foreground"
                    : positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {value}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {subtext}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cumulative P/L Chart */}
      <Card className="overflow-hidden rounded-3xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <IconSparkles size={18} className="text-[#00E575]" />
            <CardTitle className="text-base font-semibold">
              Cumulative P/L Equity Curve
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            All-Time Growth
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          <PnLChart data={chartData} />
        </CardContent>
      </Card>

      {/* Recent Trades vs. Latest Journal Entries Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Trades Feed */}
        <Card className="rounded-3xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <IconTrendingUp size={18} className="text-emerald-500" />
              <CardTitle className="text-base font-semibold">
                Recent Trades Log
              </CardTitle>
            </div>
            <Link
              href="/trades"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View all trades</span>
              <IconChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {trades
              .slice(-5)
              .reverse()
              .map((t) => {
                const pnl = Number(t.pnl)
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl border border-border/80 p-3.5 transition hover:bg-muted/50"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        {formatDate(t.date)}
                      </p>
                      <p className="max-w-[200px] truncate text-[11px] text-muted-foreground">
                        Trade Logged
                      </p>
                    </div>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        pnl >= 0
                          ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "border border-rose-500/20 bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {currency.format(pnl)}
                    </Badge>
                  </div>
                )
              })}

            {trades.length === 0 && (
              <div className="py-12 text-center">
                <IconTrendingUp
                  size={36}
                  className="mx-auto mb-2 text-muted-foreground/40"
                />
                <p className="text-sm font-medium text-foreground">
                  No trades logged yet
                </p>
                <p className="mt-1 mb-4 text-xs text-muted-foreground">
                  Start building your trading record today.
                </p>
                <Link
                  href="/trades"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575] px-4 py-2 text-xs font-semibold text-[#0F172A]"
                >
                  <IconPlus size={14} />
                  <span>Log First Trade</span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Journal Entries Feed */}
        <Card className="rounded-3xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <IconBrain size={18} className="text-purple-500" />
              <CardTitle className="text-base font-semibold">
                Trading Mindset &amp; Psychology
              </CardTitle>
            </div>
            <Link
              href="/journal"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>View all journals</span>
              <IconChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-6">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="space-y-2 rounded-2xl border border-border/80 p-4 transition hover:border-[#00E575]/40 hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {formatDate(entry.date)}
                  </span>
                  {entry.revengeTrading && (
                    <Badge className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium text-rose-600 dark:text-rose-400">
                      <IconAlertCircle size={12} />
                      <span>Revenge Trading</span>
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-[11px] font-semibold tracking-wider text-[#00E575] uppercase">
                    Trades: {entry.tradesTaken}
                  </p>
                  {entry.reason && (
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">
                      <strong>Strategy:</strong> {entry.reason}
                    </p>
                  )}
                  {entry.mindset && (
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">
                      <strong>Mindset:</strong> {entry.mindset}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {journalEntries.length === 0 && (
              <div className="py-12 text-center">
                <IconBrain
                  size={36}
                  className="mx-auto mb-2 text-muted-foreground/40"
                />
                <p className="text-sm font-medium text-foreground">
                  No journal entries yet
                </p>
                <p className="mt-1 mb-4 text-xs text-muted-foreground">
                  Reflect on your trade execution &amp; psychological state.
                </p>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <IconBook2 size={14} />
                  <span>Write Journal Entry</span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
