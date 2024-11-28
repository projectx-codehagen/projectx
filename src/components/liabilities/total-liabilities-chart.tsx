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

interface TotalLiabilitiesChartProps {
  data?: {
    date: string;
    total: number;
    mortgage: number;
    other: number;
  }[];
  type?: "total" | "mortgage" | "other";
}

export function TotalLiabilitiesChart({
  data = [],
  type = "total",
}: TotalLiabilitiesChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    value: item[type],
  }));

  const chartColors = {
    total: "hsl(var(--destructive))",
    mortgage: "hsl(var(--destructive))",
    other: "hsl(var(--destructive))",
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
            fill="url(#gradientArea-primary)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
