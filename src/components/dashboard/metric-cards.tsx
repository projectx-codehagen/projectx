"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import {
  Briefcase,
  Building2,
  Coins,
  Computer,
  CreditCard,
  Home,
  Landmark,
  LifeBuoy,
  Wallet,
  Bitcoin,
} from "lucide-react";

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
      value: "$9,234",
      decimal: ".67",
      change: "+$934.12",
      percentage: "+3.2%",
      trend: "positive",
      details: [
        { icon: Briefcase, value: "+$8,123.45", source: "Salary" },
        { icon: Coins, value: "$512.34", source: "Dividends" },
        { icon: Computer, value: "+$698.88", source: "Freelance" },
      ],
    },
    {
      title: "Spending",
      value: "$5,789",
      decimal: ".56",
      change: "+$1,478.23",
      percentage: "+2.4%",
      trend: "negative",
      details: [
        { icon: Home, value: "-$4,987.65", source: "Rent" },
        { icon: CreditCard, value: "-$312.45", source: "Utilities" },
      ],
    },
    {
      title: "Savings Rate",
      value: "1.47",
      decimal: "%",
      change: "+0.18%",
      percentage: "",
      trend: "positive",
      details: [
        { icon: LifeBuoy, value: "+0.28%", source: "Emergency Fund" },
        { icon: Wallet, value: "+0.19%", source: "Retirement" },
      ],
    },
    {
      title: "Investing",
      value: "$1,149,876",
      decimal: ".34",
      change: "+$4,987.65",
      percentage: "+1.9%",
      trend: "positive",
      details: [
        { icon: Landmark, value: "+$2,123.45", source: "Stocks" },
        { icon: Bitcoin, value: "+$2,456.78", source: "Crypto" },
        { icon: Building2, value: "+$407.42", source: "Real Estate" },
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
            <div className="flex gap-2 mt-4 flex-wrap">
              {metric.details.map((detail, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <detail.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {detail.value}
                    <span className="ml-1 text-gray-500">{detail.source}</span>
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
