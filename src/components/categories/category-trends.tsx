"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const trendData = [
  { date: "2024-01-01", food: 450, entertainment: 120, transport: 280 },
  { date: "2024-01-08", food: 500, entertainment: 150, transport: 300 },
  { date: "2024-01-15", food: 480, entertainment: 140, transport: 290 },
  { date: "2024-01-22", food: 520, entertainment: 160, transport: 310 },
];

export function CategoryTrends() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Category Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={{
                food: { label: "Food", color: "hsl(var(--chart-2))" },
                entertainment: {
                  label: "Entertainment",
                  color: "hsl(var(--chart-5))",
                },
                transport: {
                  label: "Transport",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <AreaChart data={trendData}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  width={50}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  className="text-xs text-muted-foreground"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="food"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="entertainment"
                  stackId="1"
                  stroke="hsl(var(--chart-5))"
                  fill="hsl(var(--chart-5))"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="transport"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
