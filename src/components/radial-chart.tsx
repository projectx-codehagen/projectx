"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
const chartData = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex items-center">
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-[100px] h-[110px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={-190}
              endAngle={70}
              innerRadius={34}
              outerRadius={50}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[37, 30]}
              />
              <RadialBar dataKey="visitors" background cornerRadius={20} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        ></text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <div className="ml-5">
          <h2 className="font-semibold text-xl">Title</h2>
          <p>Effective marketing and advertising materials.</p>
        </div>
      </CardContent>
    </Card>
  );
}
