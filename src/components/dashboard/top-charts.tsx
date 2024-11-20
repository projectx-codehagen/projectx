"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

// Generate more realistic data with a slight upward trend
const generateChartData = (): ChartData[] => {
  const baseValue = 2800000;
  const volatility = 15000;
  const trend = 500; // Daily upward trend

  return Array.from({ length: 30 }, (_, i) => {
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendValue = trend * i;
    return {
      date: `2024-01-${(i + 1).toString().padStart(2, "0")}`,
      value: baseValue + randomChange + trendValue,
    };
  });
};

const data = generateChartData();

const chartConfig = {
  value: {
    label: "Monthly budget",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const assetsData = [
  { category: "stocks", value: 1514220, fill: "hsl(var(--chart-1))" },
  { category: "crypto", value: 1017110, fill: "hsl(var(--chart-2))" },
  { category: "real-estate", value: 517110, fill: "hsl(var(--chart-3))" },
  { category: "cash", value: 176042, fill: "hsl(var(--chart-4))" },
];

const assetsConfig = {
  value: {
    label: "Total Assets",
  },
  stocks: {
    label: "Stocks",
    color: "hsl(var(--chart-1))",
  },
  crypto: {
    label: "Crypto",
    color: "hsl(var(--chart-2))",
  },
  "real-estate": {
    label: "Real Estate",
    color: "hsl(var(--chart-3))",
  },
  cash: {
    label: "Cash",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function TopCharts() {
  const totalAssets = React.useMemo(() => {
    return assetsData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <Select defaultValue="1M">
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="6M">6M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold">
                $1,138,491<span className="text-xl">.15</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+$1,102.15 (+0.9%)</span> vs
                last month
              </p>
            </div>
            <div className="h-[180px]">
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
                      content={<ChartTooltipContent />}
                    />
                    <defs>
                      <linearGradient
                        id="fillValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="value"
                      type="monotone"
                      fill="url(#fillValue)"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>You spent $1,102.15 more this month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assets Overview</CardTitle>
          <Select defaultValue="assets">
            <SelectTrigger className="w-[80px] h-8 text-xs">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assets">Assets</SelectItem>
              <SelectItem value="debts">Debts</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-full">
            <ChartContainer
              config={assetsConfig}
              className="mx-auto aspect-square h-[180px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={assetsData}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={4}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              ${(totalAssets / 1000000).toFixed(1)}M
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Assets
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {assetsData.map((item) => (
                <div key={item.category} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {
                      assetsConfig[item.category as keyof typeof assetsConfig]
                        .label
                    }
                    <span className="ml-1 text-gray-500">
                      ${(item.value / 1000000).toFixed(1)}M
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
