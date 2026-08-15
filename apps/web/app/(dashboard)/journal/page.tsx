"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"

interface JournalEntry {
  id: number
  date: string
  tradesTaken: string
  reason: string | null
  mindset: string | null
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
  const [editing, setEditing] = useState<JournalEntry | null>(null)

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      const res = await fetch("/api/journal")
      if (!res.ok) throw new Error("Failed to load journal")
      return res.json() as Promise<JournalEntry[]>
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["journal"] })

  const resetForm = () => {
    setEditing(null)
    setDate(today())
    setTradesTaken("")
    setReason("")
    setMindset("")
  }

  const createEntry = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, tradesTaken, reason, mindset }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save")
    },
    onSuccess: () => {
      toast.success("Journal entry saved")
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
        body: JSON.stringify({ date, tradesTaken, reason, mindset }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update")
    },
    onSuccess: () => {
      toast.success("Journal entry updated")
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {editing ? "Edit journal entry" : "Today's trade journal"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="tradesTaken">Which trades did you take today?</Label>
              <Textarea
                id="tradesTaken"
                value={tradesTaken}
                onChange={(e) => setTradesTaken(e.target.value)}
                placeholder="e.g. Bought NIFTY 25000 CE, sold at 25050... "
                rows={3}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Why did you take these trades?</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Breakout above resistance with volume..."
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mindset">What was your mindset?</Label>
              <Textarea
                id="mindset"
                value={mindset}
                onChange={(e) => setMindset(e.target.value)}
                placeholder="e.g. Confident but patient, followed my stop-loss..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createEntry.isPending || updateEntry.isPending}>
                {editing ? (
                  <>
                    <IconPencil /> Update
                  </>
                ) : (
                  <>
                    <IconPlus /> Save entry
                  </>
                )}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading...</p>}
        {!isLoading && entries.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No journal entries yet. Write about your first trading day above.
          </p>
        )}
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">{formatDate(entry.date)}</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(entry)
                    setDate(entry.date.slice(0, 10))
                    setTradesTaken(entry.tradesTaken)
                    setReason(entry.reason ?? "")
                    setMindset(entry.mindset ?? "")
                  }}
                  title="Edit"
                >
                  <IconPencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    if (confirm(`Delete journal entry for ${formatDate(entry.date)}?`))
                      deleteEntry.mutate(entry.id)
                  }}
                  title="Delete"
                  className="text-red-500 hover:text-red-600"
                >
                  <IconTrash />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="mb-1 font-medium text-muted-foreground">Trades taken</p>
                <p className="whitespace-pre-wrap">{entry.tradesTaken}</p>
              </div>
              {entry.reason && (
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Why</p>
                  <p className="whitespace-pre-wrap">{entry.reason}</p>
                </div>
              )}
              {entry.mindset && (
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Mindset</p>
                  <p className="whitespace-pre-wrap">{entry.mindset}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}