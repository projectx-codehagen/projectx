"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import * as React from "react";

const data = [
  { category: "housing", value: 1500, fill: "hsl(var(--chart-1))" },
  { category: "food", value: 500, fill: "hsl(var(--chart-2))" },
  { category: "transportation", value: 300, fill: "hsl(var(--chart-3))" },
  { category: "utilities", value: 200, fill: "hsl(var(--chart-4))" },
  { category: "entertainment", value: 150, fill: "hsl(var(--chart-5))" },
  { category: "healthcare", value: 100, fill: "hsl(var(--chart-6))" },
  { category: "other", value: 250, fill: "hsl(var(--chart-7))" },
];

const chartConfig = {
  value: {
    label: "Total Spending",
  },
  housing: {
    label: "Housing",
    color: "hsl(var(--chart-1))",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-2))",
  },
  transportation: {
    label: "Transportation",
    color: "hsl(var(--chart-3))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-4))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-5))",
  },
  healthcare: {
    label: "Healthcare",
    color: "hsl(var(--chart-6))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-7))",
  },
} as const;

export function CategoryChart() {
  const totalSpending = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
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
                          ${totalSpending.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Spending
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-xs text-muted-foreground">
              {chartConfig[item.category as keyof typeof chartConfig].label}
              <span className="ml-1 text-muted-foreground">
                ${item.value.toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
