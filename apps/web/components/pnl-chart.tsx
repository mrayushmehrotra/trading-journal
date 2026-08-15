"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export interface PnLPoint {
  date: string
  pnl: number
  cumulative: number
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function PnLChart({ data }: { data: PnLPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No trade data yet
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 220)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) => {
              const d = new Date(value)
              return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value: number) => currency.format(value)}
          />
          <Tooltip
            formatter={(value) => [currency.format(Number(value)), "P/L"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString("en-IN")}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#pnlGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}