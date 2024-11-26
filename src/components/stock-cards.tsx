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
  pe: string | number;
  weekRange: {
    low: number;
    high: number;
  };
}

const placeholderInvestments: Stock[] = [
  {
    symbol: "STOCKS",
    name: "Stocks",
    change: "+2.5%",
    data: [40, 35, 45, 30, 35, 40],
    trend: "up",
    price: 156.34,
    marketCap: "$2.8T",
    volume: "82.2M",
    pe: 28.2,
    weekRange: { low: 135.2, high: 178.4 },
  },
  {
    symbol: "CRYPTO",
    name: "Crypto",
    change: "+1.8%",
    data: [45, 40, 35, 30, 45, 40],
    trend: "up",
    price: 178.92,
    marketCap: "$980B",
    volume: "24.5B",
    pe: "N/A",
    weekRange: { low: 25800, high: 35400 },
  },
  {
    symbol: "ETF",
    name: "ETF",
    change: "+1.2%",
    data: [20, 25, 35, 45, 40, 50],
    trend: "up",
    price: 142.56,
    marketCap: "$450B",
    volume: "45.1M",
    pe: 22.4,
    weekRange: { low: 380.5, high: 425.8 },
  },
  {
    symbol: "OTHER",
    name: "Other",
    change: "+0.8%",
    data: [40, 35, 45, 35, 40, 35],
    trend: "up",
    price: 334.92,
    marketCap: "Various",
    volume: "Various",
    pe: "Various",
    weekRange: { low: 0, high: 0 },
  },
];

interface StockCardsProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

export function StockCards({ data = [] }: StockCardsProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {placeholderInvestments.map((stock) => {
          const investmentData = data?.find(
            (d) => d.originalName === stock.symbol
          );

          return (
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
                  <div className="font-medium">
                    {investmentData ? investmentData.name : stock.name}
                  </div>
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
                    {investmentData
                      ? `$${(investmentData.value / 1000).toFixed(0)}K`
                      : "$0.00"}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
