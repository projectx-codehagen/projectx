"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
  data: {
    name: string;
    amount: number;
    budget: number;
    color: string;
    percentage: number;
    progress: number;
  }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const totalSpending = data.reduce(
    (sum, category) => sum + Math.abs(category.amount),
    0
  );

  const formatAmount = (amount: number) => {
    const [dollars, cents] = Math.abs(amount).toFixed(2).split(".");
    return `$${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${cents}`;
  };

  const chartData = data
    .filter((category) => category.amount !== 0 && category.name !== "Income")
    .map((category) => ({
      category: category.name,
      value: Math.abs(category.amount),
      fill: category.color,
    }));

  const legendData = data.filter((category) => category.name !== "Income");

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          value: {
            label: "Total Spending",
          },
          ...data.reduce(
            (acc, category) => ({
              ...acc,
              [category.name]: {
                label: category.name,
                color: category.color,
              },
            }),
            {}
          ),
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <ChartTooltipContent
                      content={[
                        {
                          label: data.category,
                          value: formatAmount(data.value),
                          color: data.fill,
                        },
                      ]}
                      hideLabel
                    />
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const [dollars, cents] = totalSpending
                      .toFixed(2)
                      .split(".");
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
                          ${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          <tspan className="text-lg">.{cents}</tspan>
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
        {legendData.map((category) => (
          <div key={category.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs text-muted-foreground">
              {category.name}
              <span className="ml-1">{formatAmount(category.amount)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
