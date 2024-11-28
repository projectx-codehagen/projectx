"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface BalanceChartProps {
  data?: {
    date: string;
    total: number;
    stocks: number;
    crypto: number;
    other: number;
  }[];
  type?: "total" | "stocks" | "crypto" | "other";
}

export function BalanceChart({ data = [], type = "total" }: BalanceChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    value: item[type],
  }));

  const chartColors = {
    total: "hsl(var(--chart-1))",
    stocks: "hsl(var(--chart-2))",
    crypto: "hsl(var(--chart-3))",
    other: "hsl(var(--chart-4))",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer
        config={{
          value: {
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Value`,
            color: chartColors[type],
          },
        }}
      >
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient
              id={`gradientArea-${type}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={chartColors[type]}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={chartColors[type]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-muted"
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });
            }}
            className="text-xs text-muted-foreground"
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            className="text-xs text-muted-foreground"
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColors[type]}
            fill={`url(#gradientArea-${type})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
