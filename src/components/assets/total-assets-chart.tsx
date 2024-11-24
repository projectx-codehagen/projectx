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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Generate more realistic data with a slight upward trend
const generateChartData = () => {
  const baseValue = 1200000;
  const volatility = 15000;
  const trend = 2500; // Daily upward trend

  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i - 1));
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendValue = trend * i;
    return {
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue + randomChange + trendValue),
    };
  });
};

const data = generateChartData();

interface TotalAssetsChartProps {
  variant?: "primary" | "secondary";
}

export function TotalAssetsChart({
  variant = "primary",
}: TotalAssetsChartProps) {
  const chartConfig = {
    value: {
      label: "Total Value",
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
                          ${payload[0].value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-foreground">
                          {new Date(payload[0].payload.date).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
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
              id={`gradientArea-${variant}`}
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
                stopOpacity={0.2}
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
            fill={`url(#gradientArea-${variant})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
