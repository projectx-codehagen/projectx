"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { StockDetail } from "./stock-detail";

export interface Stock {
  symbol: string;
  name: string;
  change: string;
  data: number[];
  trend: "up" | "down";
  price: number;
  marketCap: string;
  volume: string;
  pe: number;
  weekRange: {
    low: number;
    high: number;
  };
}

const stocks: Stock[] = [
  {
    symbol: "DIS",
    name: "Disney",
    change: "+12%",
    data: [40, 35, 45, 30, 35, 40],
    trend: "up",
    price: 156.34,
    marketCap: "286.5B",
    volume: "8.2M",
    pe: 21.5,
    weekRange: { low: 132.45, high: 178.89 },
  },
  {
    symbol: "AAPL",
    name: "Apple",
    change: "-8%",
    data: [45, 40, 35, 30, 25, 20],
    trend: "down",
    price: 178.92,
    marketCap: "2.78T",
    volume: "12.4M",
    pe: 28.7,
    weekRange: { low: 155.98, high: 198.23 },
  },
  {
    symbol: "GOOG",
    name: "Alphabet",
    change: "+15%",
    data: [20, 25, 35, 45, 40, 50],
    trend: "up",
    price: 142.56,
    marketCap: "1.82T",
    volume: "9.8M",
    pe: 25.3,
    weekRange: { low: 122.23, high: 155.89 },
  },
  {
    symbol: "META",
    name: "Meta",
    change: "-5%",
    data: [40, 35, 45, 35, 40, 35],
    trend: "down",
    price: 334.92,
    marketCap: "865.2B",
    volume: "7.5M",
    pe: 32.1,
    weekRange: { low: 289.45, high: 378.12 },
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    change: "+9%",
    data: [45, 40, 35, 30, 45, 40],
    trend: "up",
    price: 145.24,
    marketCap: "1.52T",
    volume: "10.1M",
    pe: 42.8,
    weekRange: { low: 123.45, high: 168.92 },
  },
];

export function StockCards() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stocks.map((stock) => (
          <Card
            key={stock.symbol}
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => setSelectedStock(stock)}
          >
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

      <Sheet
        open={selectedStock !== null}
        onOpenChange={() => setSelectedStock(null)}
      >
        <SheetContent side="right" className="w-full sm:w-[540px]">
          {selectedStock && <StockDetail stock={selectedStock} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
