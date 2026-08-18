"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconDownload,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendar,
  IconCurrencyRupee,
  IconSparkles,
} from "@tabler/icons-react"
import { downloadCsv } from "@/lib/csv"

interface Trade {
  id: number
  date: string
  pnl: number
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

function today() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function TradesPage() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(today())
  const [pnl, setPnl] = useState("")
  const [editing, setEditing] = useState<Trade | null>(null)

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades")
      if (!res.ok) throw new Error("Failed to load trades")
      return res.json() as Promise<Trade[]>
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["trades"] })

  const createTrade = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, pnl: Number(pnl) }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save")
    },
    onSuccess: () => {
      toast.success("Trade log saved successfully!")
      setPnl("")
      setDate(today())
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const updateTrade = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/trades/${editing!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, pnl: Number(pnl) }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update")
    },
    onSuccess: () => {
      toast.success("Trade log updated successfully!")
      setEditing(null)
      setPnl("")
      setDate(today())
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteTrade = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/trades/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      toast.success("Trade entry deleted")
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || pnl === "") return
    if (editing) updateTrade.mutate()
    else createTrade.mutate()
  }

  const handleExportCsv = () => {
    downloadCsv(
      `trades-${today()}.csv`,
      ["Date", "P&L (INR)"],
      trades.map((t) => [t.date.slice(0, 10), t.pnl])
    )
  }

  const totalPnl = trades.reduce((sum, t) => sum + Number(t.pnl), 0)
  const totalProfitable = trades.filter((t) => Number(t.pnl) > 0).length
  const totalLosses = trades.filter((t) => Number(t.pnl) < 0).length

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575]/15 px-3 py-1 text-xs font-semibold text-[#00E575]">
              <IconSparkles size={14} />
              NSE &amp; BSE Trades
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Trade Executions &amp; P/L Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Record daily P&amp;L executions, monitor trading performance, and export history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={trades.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-md shadow-[#00E575]/20 transition disabled:opacity-50 active:scale-95"
          >
            <IconDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Add / Edit Form Card */}
      <Card className="rounded-3xl shadow-sm border border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {editing ? (
              <>
                <IconPencil size={18} className="text-[#00E575]" />
                <span>Edit Trade Entry</span>
              </>
            ) : (
              <>
                <IconPlus size={18} className="text-[#00E575]" />
                <span>Log Daily P/L Execution</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-5">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-medium flex items-center gap-1.5">
                <IconCalendar size={14} className="text-muted-foreground" />
                <span>Execution Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-48 rounded-xl border-border focus:border-[#00E575] focus:ring-[#00E575]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pnl" className="text-xs font-medium flex items-center gap-1.5">
                <IconCurrencyRupee size={14} className="text-muted-foreground" />
                <span>Profit / Loss (₹)</span>
              </Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
                placeholder="e.g. 2500 or -1200"
                className="w-56 rounded-xl border-border focus:border-[#00E575] focus:ring-[#00E575]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={createTrade.isPending || updateTrade.isPending}
              className="bg-[#00E575] hover:bg-[#00D66C] text-[#0F172A] font-semibold rounded-full px-6 py-2.5 shadow-md shadow-[#00E575]/20 text-sm transition active:scale-95"
            >
              {editing ? "Update Trade Log" : "Save Trade Log"}
            </Button>

            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null)
                  setPnl("")
                  setDate(today())
                }}
                className="rounded-full text-sm"
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Trade History Feed Card */}
      <Card className="rounded-3xl shadow-sm border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">Execution History</CardTitle>
            <Badge variant="outline" className="text-xs font-medium">
              {trades.length} Entries
            </Badge>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="text-emerald-500 font-semibold">{totalProfitable} Profit Days</span>
            <span>·</span>
            <span className="text-rose-500 font-semibold">{totalLosses} Loss Days</span>
            <span>·</span>
            <span className="text-foreground font-bold">Total: {currency.format(totalPnl)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-6">
          {isLoading && (
            <p className="py-8 text-center text-sm text-muted-foreground animate-pulse">
              Loading trade logs...
            </p>
          )}

          {!isLoading && trades.length === 0 && (
            <div className="py-12 text-center">
              <IconTrendingUp size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-semibold text-foreground">No trades recorded yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Log your daily P&amp;L above to start tracking your cumulative equity curve and win rates.
              </p>
            </div>
          )}

          {trades.map((t) => {
            const isPositive = t.pnl >= 0
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-border/80 p-4 transition hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isPositive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isPositive ? <IconTrendingUp size={20} /> : <IconTrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{formatDate(t.date)}</p>
                    <p className="text-xs text-muted-foreground">Trade Logged</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                      isPositive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {currency.format(t.pnl)}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(t)
                      setDate(t.date.slice(0, 10))
                      setPnl(String(t.pnl))
                    }}
                    title="Edit"
                    className="h-8 w-8 rounded-full hover:bg-muted"
                  >
                    <IconPencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Delete trade entry for ${formatDate(t.date)}?`))
                        deleteTrade.mutate(t.id)
                    }}
                    title="Delete"
                    className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}