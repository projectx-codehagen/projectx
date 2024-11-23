"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const stocks = [
  {
    symbol: "DIS",
    name: "Disney",
    change: "+12%",
    data: [40, 35, 45, 30, 35, 40],
    trend: "up",
  },
  {
    symbol: "AAPL",
    name: "Apple",
    change: "-8%",
    data: [45, 40, 35, 30, 25, 20],
    trend: "down",
  },
  {
    symbol: "GOOG",
    name: "Alphabet",
    change: "+15%",
    data: [20, 25, 35, 45, 40, 50],
    trend: "up",
  },
  {
    symbol: "META",
    name: "Meta",
    change: "-5%",
    data: [40, 35, 45, 35, 40, 35],
    trend: "down",
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    change: "+9%",
    data: [45, 40, 35, 30, 45, 40],
    trend: "up",
  },
];

export function StockCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {stocks.map((stock) => (
        <Card key={stock.symbol}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {stock.symbol}
              </div>
              <div className="font-medium">{stock.name}</div>
              <div className="h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stock.data.map((value) => ({ value }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={
                        stock.trend === "up"
                          ? "hsl(var(--chart-2))"
                          : "hsl(var(--destructive))"
                      }
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                  stock.trend === "up"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {stock.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
