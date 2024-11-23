"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { value: 100 },
  { value: 120 },
  { value: 110 },
  { value: 105 },
  { value: 100 },
  { value: 110 },
  { value: 115 },
  { value: 140 },
]

interface BalanceChartProps {
  variant?: "primary" | "secondary"
}

export function BalanceChart({ variant = "primary" }: BalanceChartProps) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-zinc-400">Value</span>
                        <span className="font-bold text-zinc-50">
                          ${payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={variant === "primary" ? "#3b82f6" : "#22c55e"}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: variant === "primary" ? "#3b82f6" : "#22c55e",
              strokeWidth: 0,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

