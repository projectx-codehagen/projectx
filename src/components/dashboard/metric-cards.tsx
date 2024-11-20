"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";

// Sample data for the sparklines
const generateData = (count: number, positive: boolean) => {
  return Array.from({ length: count }, (_, i) => ({
    value: positive ? 50 + Math.random() * 20 : 70 - Math.random() * 20,
  }));
};

export function MetricCards() {
  const metrics = [
    {
      title: "Income",
      value: "$8,411",
      decimal: ".11",
      change: "+$871.22",
      percentage: "+2.8%",
      trend: "positive",
      details: [
        { icon: "blue", value: "+$7,514.22" },
        { icon: "red", value: "$387.11" },
        { icon: "gray", value: "+$100.00" },
      ],
    },
    {
      title: "Spending",
      value: "$6,112",
      decimal: ".24",
      change: "+$1,704.56",
      percentage: "+1.9%",
      trend: "negative",
      details: [
        { icon: "blue", value: "-$5,844.11" },
        { icon: "red", value: "-$124.81" },
      ],
    },
    {
      title: "Savings Rate",
      value: "1.2",
      decimal: "%",
      change: "-0.3%",
      percentage: "",
      trend: "negative",
      details: [
        { icon: "blue", value: "+0.2%" },
        { icon: "red", value: "-0.5%" },
      ],
    },
    {
      title: "Investing",
      value: "$1,120,448",
      decimal: ".79",
      change: "+$3,286.91",
      percentage: "+1.8%",
      trend: "positive",
      details: [
        { icon: "purple", value: "+$1,514.22" },
        { icon: "black", value: "+$1,017.11" },
        { icon: "green", value: "+$517.11" },
        { icon: "blue", value: "+$517.11" },
        { icon: "gray", value: "+2" },
      ],
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.value}
              <span className="text-xl">{metric.decimal}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span
                className={
                  metric.trend === "positive"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {metric.change} {metric.percentage}
              </span>{" "}
              vs last month
            </div>
            <div className="h-[80px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateData(20, metric.trend === "positive")}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.trend === "positive" ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2 mt-4">
              {metric.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full bg-${detail.icon}-500`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
