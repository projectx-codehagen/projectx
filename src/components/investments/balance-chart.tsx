"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Generate more realistic data with a slight upward trend
const generateChartData = () => {
  const baseValue = 6800;
  const volatility = 150;
  const trend = 25; // Daily upward trend

  return Array.from({ length: 30 }, (_, i) => {
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendValue = trend * i;
    return {
      date: `2024-01-${(i + 1).toString().padStart(2, "0")}`,
      value: Math.round(baseValue + randomChange + trendValue),
    };
  });
};

const data = generateChartData();

interface BalanceChartProps {
  variant?: "primary" | "secondary";
}

export function BalanceChart({ variant = "primary" }: BalanceChartProps) {
  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color:
        variant === "primary" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
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
            tickFormatter={(value) => value.split("-")[2]}
            className="text-xs text-muted-foreground"
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Value
                        </span>
                        <span className="font-bold text-foreground">
                          ${payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-foreground">
                          {payload[0].payload.date.split("-")[2]}
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
              id={`fillGradient-${variant}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={
                  variant === "primary"
                    ? "hsl(var(--chart-1))"
                    : "hsl(var(--chart-2))"
                }
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={
                  variant === "primary"
                    ? "hsl(var(--chart-1))"
                    : "hsl(var(--chart-2))"
                }
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={
              variant === "primary"
                ? "hsl(var(--chart-1))"
                : "hsl(var(--chart-2))"
            }
            strokeWidth={2}
            fill={`url(#fillGradient-${variant})`}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
