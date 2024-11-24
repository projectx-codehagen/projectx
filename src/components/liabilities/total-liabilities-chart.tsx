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
  type ChartConfig,
} from "@/components/ui/chart";

const generateChartData = () => {
  const baseValue = 450000;
  const volatility = 5000;
  const trend = -1500; // Downward trend as we're paying off debt

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

interface TotalLiabilitiesChartProps {
  variant?: "primary" | "secondary";
}

export function TotalLiabilitiesChart({
  variant = "primary",
}: TotalLiabilitiesChartProps) {
  const chartConfig = {
    value: {
      label: "Total Liabilities",
      color:
        variant === "primary"
          ? "hsl(var(--destructive))"
          : "hsl(var(--destructive))",
    },
  } satisfies ChartConfig;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={data}
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
          <Tooltip
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
                          ${payload[0]?.value?.toLocaleString() ?? 0}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-foreground">
                          {new Date(payload[0].payload.date).toLocaleDateString(
                            [],
                            { month: "short", day: "numeric" }
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
              id="liabilitiesGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--destructive))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--destructive))"
            fill="url(#liabilitiesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
