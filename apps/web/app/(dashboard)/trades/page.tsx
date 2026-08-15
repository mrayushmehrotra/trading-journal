"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"

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
      toast.success("Trade saved")
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
      toast.success("Trade updated")
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
      toast.success("Trade deleted")
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{editing ? "Edit trade" : "Add daily P/L"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-44"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pnl">Profit / Loss (₹)</Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
                placeholder="e.g. 2500 or -1200"
                className="w-48"
                required
              />
            </div>
            <Button type="submit" disabled={createTrade.isPending || updateTrade.isPending}>
              {editing ? (
                <>
                  <IconPencil /> Update
                </>
              ) : (
                <>
                  <IconPlus /> Add
                </>
              )}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(null)
                  setPnl("")
                  setDate(today())
                }}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trade History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading...</p>}
          {!isLoading && trades.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No trades recorded yet. Add your first daily P/L above.
            </p>
          )}
          {trades.map((t) => {
            const isPositive = t.pnl >= 0
            return (
              <div key={t.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-sm font-medium">{formatDate(t.date)}</span>
                <div className="flex items-center gap-2">
                  <Badge className={isPositive ? "bg-[#22C55E]/15 text-[#16A34A]" : "bg-red-500/10 text-red-600"}>
                    {isPositive ? "+" : ""}
                    {currency.format(t.pnl)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setEditing(t)
                      setDate(t.date.slice(0, 10))
                      setPnl(String(t.pnl))
                    }}
                    title="Edit"
                  >
                    <IconPencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (confirm(`Delete trade for ${formatDate(t.date)}?`)) deleteTrade.mutate(t.id)
                    }}
                    title="Delete"
                    className="text-red-500 hover:text-red-600"
                  >
                    <IconTrash />
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