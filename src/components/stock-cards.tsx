"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer } from "recharts"

const stocks = [
  { symbol: "DIS", name: "Disney", change: "12%", data: [40, 35, 45, 30, 35, 40] },
  { symbol: "AAPL", name: "Apple", change: "12%", data: [45, 40, 35, 30, 25, 20] },
  { symbol: "GOOG", name: "Alphabet (Google)", change: "12%", data: [20, 25, 35, 45, 40, 50] },
  { symbol: "FB", name: "Facebook", change: "12%", data: [40, 35, 45, 35, 40, 35] },
  { symbol: "AMZN", name: "Amazon Inc.", change: "12%", data: [45, 40, 35, 30, 25, 20] },
]

export function StockCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm text-zinc-400">{stock.symbol}</div>
              <div className="font-medium text-white">{stock.name}</div>
              <div className="h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.data.map((value) => ({ value }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs">
                {stock.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

