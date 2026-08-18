"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconDownload,
  IconBrain,
  IconBook2,
  IconCalendar,
  IconAlertTriangle,
  IconTrendingUp,
  IconTarget,
  IconAlertCircle,
} from "@tabler/icons-react"
import { downloadCsv } from "@/lib/csv"

interface JournalEntry {
  id: number
  date: string
  tradesTaken: string
  reason: string | null
  mindset: string | null
  revengeTrading: boolean
}

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

export default function JournalPage() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(today())
  const [tradesTaken, setTradesTaken] = useState("")
  const [reason, setReason] = useState("")
  const [mindset, setMindset] = useState("")
  const [revengeTrading, setRevengeTrading] = useState(false)
  const [editing, setEditing] = useState<JournalEntry | null>(null)

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      const res = await fetch("/api/journal")
      if (!res.ok) throw new Error("Failed to load journal")
      return res.json() as Promise<JournalEntry[]>
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["journal"] })

  const resetForm = () => {
    setEditing(null)
    setDate(today())
    setTradesTaken("")
    setReason("")
    setMindset("")
    setRevengeTrading(false)
  }

  const createEntry = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          tradesTaken,
          reason,
          mindset,
          revengeTrading,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save")
    },
    onSuccess: () => {
      toast.success("Journal entry saved!")
      resetForm()
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const updateEntry = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/journal/${editing!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          tradesTaken,
          reason,
          mindset,
          revengeTrading,
        }),
      })
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Failed to update")
    },
    onSuccess: () => {
      toast.success("Journal entry updated!")
      resetForm()
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteEntry = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    },
    onSuccess: () => {
      toast.success("Journal entry deleted")
      invalidate()
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !tradesTaken.trim()) return
    if (editing) updateEntry.mutate()
    else createEntry.mutate()
  }

  const handleExportCsv = () => {
    downloadCsv(
      `journal-${today()}.csv`,
      ["Date", "Trades Taken", "Reason", "Mindset", "Revenge Trading"],
      entries.map((entry) => [
        entry.date.slice(0, 10),
        entry.tradesTaken,
        entry.reason ?? "",
        entry.mindset ?? "",
        entry.revengeTrading ? "Yes" : "No",
      ])
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E575]/15 px-3 py-1 text-xs font-semibold text-[#00E575]">
              <IconBrain size={14} />
              Trading Psychology &amp; Reflection
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Daily Trade Journal
          </h1>
          <p className="text-sm text-muted-foreground">
            Reflect on trade execution reasons, psychological state, and
            emotional discipline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={entries.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-[#00E575] px-5 py-2.5 text-xs font-semibold text-[#0F172A] shadow-md shadow-[#00E575]/20 transition hover:bg-[#00D66C] active:scale-95 disabled:opacity-50 sm:text-sm"
          >
            <IconDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Write / Edit Journal Entry Card */}
      <Card className="rounded-3xl border border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {editing ? (
              <>
                <IconPencil size={18} className="text-[#00E575]" />
                <span>Edit Journal Entry</span>
              </>
            ) : (
              <>
                <IconPlus size={18} className="text-[#00E575]" />
                <span>Write Today&apos;s Trade Reflection</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="flex items-center gap-1.5 text-xs font-medium"
              >
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
              <Label htmlFor="tradesTaken" className="text-xs font-medium">
                Which trades did you take today?
              </Label>
              <Textarea
                id="tradesTaken"
                value={tradesTaken}
                onChange={(e) => setTradesTaken(e.target.value)}
                placeholder="e.g. Bought NIFTY 25000 CE, sold at 25050..."
                rows={3}
                className="rounded-2xl border-border focus:border-[#00E575] focus:ring-[#00E575]"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-xs font-medium">
                  Why did you take these trades?
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Breakout above resistance with high volume..."
                  rows={3}
                  className="rounded-2xl border-border focus:border-[#00E575] focus:ring-[#00E575]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mindset" className="text-xs font-medium">
                  What was your emotional mindset?
                </Label>
                <Textarea
                  id="mindset"
                  value={mindset}
                  onChange={(e) => setMindset(e.target.value)}
                  placeholder="e.g. Calm and patient, stuck strictly to stop-loss..."
                  rows={3}
                  className="rounded-2xl border-border focus:border-[#00E575] focus:ring-[#00E575]"
                />
              </div>
            </div>

            {/* Revenge Trading Switch */}
            <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/30 p-4">
              <div className="space-y-0.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconAlertTriangle
                    size={14}
                    className={
                      revengeTrading ? "text-rose-500" : "text-muted-foreground"
                    }
                  />
                  <span>Did you engage in revenge trading today?</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Trading impulsively to recover a loss instead of following
                  your strategy.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={revengeTrading}
                aria-label="Revenge trading status"
                onClick={() => setRevengeTrading((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  revengeTrading ? "bg-rose-500" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    revengeTrading ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={createEntry.isPending || updateEntry.isPending}
                className="rounded-full bg-[#00E575] px-6 py-2.5 text-sm font-semibold text-[#0F172A] shadow-md shadow-[#00E575]/20 transition hover:bg-[#00D66C] active:scale-95"
              >
                {editing ? "Update Journal Entry" : "Save Journal Entry"}
              </Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="rounded-full text-sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Past Entries Grid */}
      <Card className="overflow-hidden rounded-3xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">
              Past Reflections
            </CardTitle>
            <Badge variant="outline" className="text-xs font-medium">
              {entries.length} Logs
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {isLoading && (
            <p className="animate-pulse py-8 text-center text-sm text-muted-foreground">
              Loading journal entries...
            </p>
          )}

          {!isLoading && entries.length === 0 && (
            <div className="py-12 text-center">
              <IconBook2
                size={40}
                className="mx-auto mb-3 text-muted-foreground/30"
              />
              <p className="text-sm font-semibold text-foreground">
                No journal entries recorded yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                Write your first daily reflection above to track execution
                discipline over time.
              </p>
            </div>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="space-y-5 rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-[#00E575]/40 hover:shadow-md"
            >
              {/* Card Top Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00E575]/15 text-[#00E575]">
                    <IconCalendar size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      {formatDate(entry.date)}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Daily Reflection Logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {entry.revengeTrading && (
                    <Badge className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <IconAlertCircle size={14} />
                      <span>Revenge Trading Alert</span>
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(entry)
                      setDate(entry.date.slice(0, 10))
                      setTradesTaken(entry.tradesTaken)
                      setReason(entry.reason ?? "")
                      setMindset(entry.mindset ?? "")
                      setRevengeTrading(entry.revengeTrading)
                    }}
                    title="Edit Entry"
                    className="h-8 w-8 rounded-full hover:bg-muted"
                  >
                    <IconPencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (
                        confirm(
                          `Delete journal entry for ${formatDate(entry.date)}?`
                        )
                      )
                        deleteEntry.mutate(entry.id)
                    }}
                    title="Delete Entry"
                    className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </div>

              {/* Trades Executed Box */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00E575]">
                  <IconTrendingUp size={16} />
                  <span className="tracking-wider uppercase">
                    Trades Executed
                  </span>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed font-semibold text-foreground">
                  <p className="whitespace-pre-wrap">{entry.tradesTaken}</p>
                </div>
              </div>

              {/* Strategy Reason & Mindset Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Execution Reason Box */}
                {entry.reason && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-500">
                      <IconTarget size={16} />
                      <span className="tracking-wider uppercase">
                        Execution Strategy / Reason
                      </span>
                    </div>
                    <div className="rounded-2xl border border-l-4 border-sky-500 border-sky-500/20 bg-sky-500/5 p-4 text-xs leading-relaxed text-foreground">
                      <p className="whitespace-pre-wrap">{entry.reason}</p>
                    </div>
                  </div>
                )}

                {/* Psychological Mindset Box */}
                {entry.mindset && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-500">
                      <IconBrain size={16} />
                      <span className="tracking-wider uppercase">
                        Psychological Mindset
                      </span>
                    </div>
                    <div className="rounded-2xl border border-l-4 border-purple-500 border-purple-500/20 bg-purple-500/5 p-4 text-xs leading-relaxed text-foreground">
                      <p className="whitespace-pre-wrap">{entry.mindset}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Revenge Trading Warning Banner inside card */}
              {entry.revengeTrading && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <IconAlertTriangle size={18} className="shrink-0" />
                  <span>
                    <strong>Caution:</strong> Emotional revenge trading was
                    flagged during this session. Review your risk management
                    plan.
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
