"use client";

import { Stock } from "./stock-cards";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Calendar, BarChart2, Globe } from "lucide-react";

// Generate more detailed data for the detailed view
const generateDetailedData = (
  baseValue: number,
  trend: "up" | "down",
  days: number
) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const multiplier = trend === "up" ? 1 : -1;
    const change = (Math.random() * 2 - 1 + 0.2) * multiplier;
    return {
      date: date.toISOString().split("T")[0],
      value: +(baseValue + change * (baseValue * 0.02)).toFixed(2),
    };
  });
};

interface StockDetailProps {
  stock: Stock;
}

export function StockDetail({ stock }: StockDetailProps) {
  const dayData = generateDetailedData(stock.price, stock.trend, 24);
  const weekData = generateDetailedData(stock.price, stock.trend, 7);
  const monthData = generateDetailedData(stock.price, stock.trend, 30);

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle>{stock.name}</SheetTitle>
            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${stock.price}</div>
            <div
              className={`text-sm ${
                stock.trend === "up" ? "text-green-500" : "text-destructive"
              }`}
            >
              {stock.change}
            </div>
          </div>
        </div>
      </SheetHeader>

      <Tabs defaultValue="1D" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1D" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>1D</span>
          </TabsTrigger>
          <TabsTrigger value="1W" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>1W</span>
          </TabsTrigger>
          <TabsTrigger value="1M" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>1M</span>
          </TabsTrigger>
        </TabsList>

        {["1D", "1W", "1M"].map((period) => (
          <TabsContent key={period} value={period} className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    period === "1D"
                      ? dayData
                      : period === "1W"
                      ? weekData
                      : monthData
                  }
                >
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      period === "1D"
                        ? new Date(value).toLocaleTimeString([], {
                            hour: "2-digit",
                          })
                        : new Date(value).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })
                    }
                    className="text-xs"
                  />
                  <YAxis
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                    className="text-xs"
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Price
                                </span>
                                <span className="font-bold">
                                  ${Number(payload[0].value).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Time
                                </span>
                                <span className="font-bold">
                                  {period === "1D"
                                    ? new Date(
                                        payload[0].payload.date
                                      ).toLocaleTimeString()
                                    : new Date(
                                        payload[0].payload.date
                                      ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <defs>
                    <linearGradient
                      id={`gradientArea-${period}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          stock.trend === "up"
                            ? "hsl(var(--chart-2))"
                            : "hsl(var(--destructive))"
                        }
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          stock.trend === "up"
                            ? "hsl(var(--chart-2))"
                            : "hsl(var(--destructive))"
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={
                      stock.trend === "up"
                        ? "hsl(var(--chart-2))"
                        : "hsl(var(--destructive))"
                    }
                    fill={`url(#gradientArea-${period})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/50 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Market Cap</p>
          </div>
          <p className="font-medium">{stock.marketCap}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Volume</p>
          </div>
          <p className="font-medium">{stock.volume}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">P/E Ratio</p>
          </div>
          <p className="font-medium">{stock.pe}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">52W Range</p>
          </div>
          <p className="font-medium">
            ${stock.weekRange.low} - ${stock.weekRange.high}
          </p>
        </div>
      </div>
    </div>
  );
}
