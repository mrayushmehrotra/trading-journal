import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/server"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { PnLChart } from "@/components/pnl-chart"
import { IconTrendingUp, IconTrendingDown, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react"
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
      take: 3,
    }),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const todayTrade = trades.find((t) => t.date.toISOString().slice(0, 10) === today)

  const totalPnl = trades.reduce((sum, t) => sum + Number(t.pnl), 0)
  const profitableDays = trades.filter((t) => Number(t.pnl) > 0).length
  const winRate = trades.length > 0 ? (profitableDays / trades.length) * 100 : 0
  const bestDay = trades.reduce<{ pnl: number; date: Date | null }>(
    (best, t) => (Number(t.pnl) > best.pnl ? { pnl: Number(t.pnl), date: t.date } : best),
    { pnl: -Infinity, date: null }
  )
  const worstDay = trades.reduce<{ pnl: number; date: Date | null }>(
    (worst, t) => (Number(t.pnl) < worst.pnl ? { pnl: Number(t.pnl), date: t.date } : worst),
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
      icon: todayTrade && Number(todayTrade.pnl) < 0 ? IconArrowDownRight : IconArrowUpRight,
    },
    { label: "Total P/L", value: currency.format(totalPnl), positive: totalPnl >= 0, icon: totalPnl >= 0 ? IconArrowUpRight : IconArrowDownRight },
    {
      label: "Win Rate",
      value: trades.length > 0 ? `${winRate.toFixed(1)}%` : "—",
      positive: winRate >= 50,
      icon: IconTrendingUp,
    },
    {
      label: "Best Day",
      value: bestDay.date ? currency.format(bestDay.pnl) : "—",
      positive: true,
      icon: IconTrendingUp,
    },
    {
      label: "Worst Day",
      value: worstDay.date ? currency.format(worstDay.pnl) : "—",
      positive: false,
      icon: IconTrendingDown,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, positive, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon
                size={18}
                stroke={1.8}
                className={positive === null ? "text-muted-foreground" : positive ? "text-[#22C55E]" : "text-red-500"}
              />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${positive === null ? "" : positive ? "text-[#16A34A]" : "text-red-600"}`}>
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cumulative P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <PnLChart data={chartData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Trades</CardTitle>
            <Link href="/trades" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {trades.slice(-5).reverse().map((t) => {
              const pnl = Number(t.pnl)
              return (
                <div key={t.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-sm font-medium">{formatDate(t.date)}</span>
                  <Badge className={pnl >= 0 ? "bg-[#22C55E]/15 text-[#16A34A]" : "bg-red-500/10 text-red-600"}>
                    {pnl >= 0 ? "+" : ""}
                    {currency.format(pnl)}
                  </Badge>
                </div>
              )
            })}
            {trades.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No trades yet.{" "}
                <Link href="/trades" className="text-primary hover:underline">
                  Add your first trade
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Latest Journal</CardTitle>
            <Link href="/journal" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="rounded-lg border px-3 py-2">
                <p className="text-sm font-medium">{formatDate(entry.date)}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.tradesTaken}</p>
              </div>
            ))}
            {journalEntries.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No journal entries yet.{" "}
                <Link href="/journal" className="text-primary hover:underline">
                  Write your first entry
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}