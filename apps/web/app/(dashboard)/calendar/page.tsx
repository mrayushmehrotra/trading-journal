"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconSparkles,
  IconBrain,
  IconFlame,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react"

interface Trade {
  id: number
  date: string
  pnl: number
  notes?: string
}

interface JournalEntry {
  id: number
  date: string
  tradesTaken: string
  reason: string | null
  mindset: string | null
  revengeTrading: boolean
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function CalendarPage() {
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDayDetail, setSelectedDayDetail] = useState<{
    dateStr: string
    trade?: Trade
    journal?: JournalEntry
  } | null>(null)

  const { data: trades = [] } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades")
      if (!res.ok) throw new Error("Failed to load trades")
      return res.json() as Promise<Trade[]>
    },
  })

  const { data: journalEntries = [] } = useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      const res = await fetch("/api/journal")
      if (!res.ok) throw new Error("Failed to load journal")
      return res.json() as Promise<JournalEntry[]>
    },
  })

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  // Calendar Calculation Helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  // Adjust Monday-start index: Sunday is 0, so (day + 6) % 7 gives Mon=0, Sun=6
  const firstDayOfWeek =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7

  // Filter trades for the selected month
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
  const monthTrades = trades.filter((t) => t.date.slice(0, 7) === monthPrefix)

  const monthTotalPnl = monthTrades.reduce((sum, t) => sum + Number(t.pnl), 0)
  const monthProfitDays = monthTrades.filter((t) => Number(t.pnl) > 0).length
  const monthLossDays = monthTrades.filter((t) => Number(t.pnl) < 0).length
  const monthWinRate =
    monthTrades.length > 0 ? (monthProfitDays / monthTrades.length) * 100 : 0

  const monthBestDay = monthTrades.reduce<{ pnl: number; date: string | null }>(
    (best, t) =>
      Number(t.pnl) > best.pnl ? { pnl: Number(t.pnl), date: t.date } : best,
    { pnl: -Infinity, date: null }
  )

  const monthWorstDay = monthTrades.reduce<{
    pnl: number
    date: string | null
  }>(
    (worst, t) =>
      Number(t.pnl) < worst.pnl ? { pnl: Number(t.pnl), date: t.date } : worst,
    { pnl: Infinity, date: null }
  )

  const todayStr = currentDate.toISOString().slice(0, 10)

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575]/15 px-3 py-1 text-xs font-semibold text-[#00E575]">
              <IconCalendar size={14} />
              Monthly Heatmap Overview
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            P&amp;L Calendar Heatmap
          </h1>
          <p className="text-sm text-muted-foreground">
            Visual month-by-month consistency tracker with daily P&amp;L
            indicators and execution logs.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-10 w-10 rounded-full"
            title="Previous Month"
          >
            <IconChevronLeft size={18} />
          </Button>

          <span className="min-w-[140px] px-3 text-center text-base font-bold text-foreground">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-10 w-10 rounded-full"
            title="Next Month"
          >
            <IconChevronRight size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="ml-2 rounded-full px-4 text-xs font-semibold"
          >
            Today
          </Button>
        </div>
      </div>

      {/* 4 Monthly Metric Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Monthly P&amp;L
            </span>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                monthTotalPnl >= 0
                  ? "bg-emerald-500/15 text-emerald-600"
                  : "bg-rose-500/15 text-rose-600"
              }`}
            >
              {monthTotalPnl >= 0 ? (
                <IconArrowUpRight size={16} />
              ) : (
                <IconArrowDownRight size={16} />
              )}
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              monthTotalPnl >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {currency.format(monthTotalPnl)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {monthTrades.length} trade days in {MONTH_NAMES[currentMonth]}
          </p>
        </Card>

        <Card className="rounded-2xl border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Win-Loss Days
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <IconTrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {monthProfitDays}W{" "}
            <span className="text-lg font-normal text-muted-foreground">/</span>{" "}
            <span className="text-rose-500">{monthLossDays}L</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {monthWinRate.toFixed(1)}% Monthly Win Rate
          </p>
        </Card>

        <Card className="rounded-2xl border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Best Day
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <IconTrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {monthBestDay.date ? currency.format(monthBestDay.pnl) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {monthBestDay.date ? monthBestDay.date.slice(0, 10) : "No trades"}
          </p>
        </Card>

        <Card className="rounded-2xl border border-border/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Worst Day
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600">
              <IconTrendingDown size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {monthWorstDay.date ? currency.format(monthWorstDay.pnl) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {monthWorstDay.date ? monthWorstDay.date.slice(0, 10) : "No trades"}
          </p>
        </Card>
      </div>

      {/* Main Interactive Calendar Heatmap Grid */}
      <Card className="overflow-hidden rounded-3xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <IconSparkles size={18} className="text-[#00E575]" />
            <CardTitle className="text-base font-semibold">
              {MONTH_NAMES[currentMonth]} {currentYear} Heatmap
            </CardTitle>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-3 w-3 rounded-full border border-emerald-500 bg-emerald-500/40" />
              Profit Day
            </span>
            <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
              <span className="h-3 w-3 rounded-full border border-rose-500 bg-rose-500/40" />
              Loss Day
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Days of Week Header */}
          <div className="mb-3 grid grid-cols-7 gap-2 text-center sm:gap-3">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Tiles */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* Empty padding cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="h-20 rounded-2xl bg-muted/20 opacity-40 sm:h-24"
              />
            ))}

            {/* Actual Days of the Month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNum = index + 1
              const dayStr = String(dayNum).padStart(2, "0")
              const fullDateStr = `${monthPrefix}-${dayStr}`
              const isToday = fullDateStr === todayStr

              const trade = trades.find(
                (t) => t.date.slice(0, 10) === fullDateStr
              )
              const journal = journalEntries.find(
                (j) => j.date.slice(0, 10) === fullDateStr
              )

              const pnl = trade ? Number(trade.pnl) : null
              const isProfit = pnl !== null && pnl > 0
              const isLoss = pnl !== null && pnl < 0
              const isZero = pnl !== null && pnl === 0

              return (
                <button
                  key={fullDateStr}
                  onClick={() =>
                    setSelectedDayDetail({
                      dateStr: fullDateStr,
                      trade,
                      journal,
                    })
                  }
                  className={`group relative flex h-20 flex-col justify-between rounded-2xl p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:h-24 sm:p-3 ${
                    isToday
                      ? "ring-2 ring-[#00E575] ring-offset-2 ring-offset-background"
                      : ""
                  } ${
                    isProfit
                      ? "border border-emerald-500/35 bg-emerald-500/15 hover:bg-emerald-500/25"
                      : isLoss
                        ? "border border-rose-500/35 bg-rose-500/15 hover:bg-rose-500/25"
                        : isZero
                          ? "border border-border/60 bg-muted/40"
                          : "border border-border/50 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`text-xs font-bold sm:text-sm ${
                        isToday ? "text-[#00E575]" : "text-foreground"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {journal && (
                      <span
                        className="flex h-2 w-2 rounded-full bg-purple-500"
                        title="Journal logged"
                      />
                    )}
                  </div>

                  <div className="mt-auto">
                    {pnl !== null ? (
                      <div className="space-y-0.5">
                        <span
                          className={`block truncate text-xs font-extrabold sm:text-sm ${
                            isProfit
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isLoss
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {isProfit ? "+" : ""}
                          {currency.format(pnl)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground/40">
                        —
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Details Modal / Drawer Dialog */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm fade-in">
          <div className="relative w-full max-w-lg space-y-6 rounded-3xl border border-border bg-card p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E575]/15 text-[#00E575]">
                  <IconCalendar size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedDayDetail.dateStr}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Execution &amp; Reflection Details
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDayDetail(null)}
                className="h-8 w-8 rounded-full"
              >
                <IconX size={18} />
              </Button>
            </div>

            {/* Trade P&L Details */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <IconTrendingUp size={16} className="text-[#00E575]" />
                <span>Trade P&amp;L Execution</span>
              </h4>

              {selectedDayDetail.trade ? (
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/30 p-4">
                  <span className="text-sm font-semibold text-foreground">
                    Day P&amp;L Result:
                  </span>
                  <Badge
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      Number(selectedDayDetail.trade.pnl) >= 0
                        ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "border border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {Number(selectedDayDetail.trade.pnl) >= 0 ? "+" : ""}
                    {currency.format(Number(selectedDayDetail.trade.pnl))}
                  </Badge>
                </div>
              ) : (
                <p className="py-2 text-xs text-muted-foreground italic">
                  No P&amp;L trade logged for this day.
                </p>
              )}
            </div>

            {/* Journal Reflection Details */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <IconBrain size={16} className="text-purple-500" />
                <span>Psychology &amp; Journal Notes</span>
              </h4>

              {selectedDayDetail.journal ? (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1 rounded-2xl border border-border/80 bg-muted/30 p-3.5">
                    <p className="font-semibold text-[#00E575]">
                      Trades Executed:
                    </p>
                    <p className="whitespace-pre-wrap text-foreground">
                      {selectedDayDetail.journal.tradesTaken}
                    </p>
                  </div>

                  {selectedDayDetail.journal.reason && (
                    <div className="space-y-1 rounded-2xl border-l-4 border-sky-500 bg-sky-500/5 p-3.5">
                      <p className="font-semibold text-sky-500">
                        Execution Strategy / Reason:
                      </p>
                      <p className="whitespace-pre-wrap text-foreground">
                        {selectedDayDetail.journal.reason}
                      </p>
                    </div>
                  )}

                  {selectedDayDetail.journal.mindset && (
                    <div className="space-y-1 rounded-2xl border-l-4 border-purple-500 bg-purple-500/5 p-3.5">
                      <p className="font-semibold text-purple-500">
                        Psychological Mindset:
                      </p>
                      <p className="whitespace-pre-wrap text-foreground">
                        {selectedDayDetail.journal.mindset}
                      </p>
                    </div>
                  )}

                  {selectedDayDetail.journal.revengeTrading && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 font-medium text-rose-600 dark:text-rose-400">
                      <IconAlertCircle size={16} />
                      <span>Revenge trading was flagged for this session.</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-2 text-xs text-muted-foreground italic">
                  No journal reflection entry logged for this day.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDayDetail(null)}
                className="rounded-full px-5 text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
