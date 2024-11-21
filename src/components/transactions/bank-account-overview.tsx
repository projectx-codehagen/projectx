"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OverviewMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
}

const metrics: OverviewMetric[] = [
  {
    title: "Total Balance",
    value: 52101.5,
    change: 20.1,
    icon: Wallet,
  },
  {
    title: "Total Income",
    value: 14235.25,
    change: 10.5,
    icon: TrendingUp,
  },
  {
    title: "Total Expenses",
    value: 8426.75,
    change: 7.2,
    icon: TrendingDown,
  },
];

const monthlyData = [
  { name: "Jan", income: 12500, expenses: 8400 },
  { name: "Feb", income: 13100, expenses: 7900 },
  { name: "Mar", income: 14200, expenses: 8100 },
  { name: "Apr", income: 13800, expenses: 8300 },
  { name: "May", income: 14500, expenses: 8200 },
  { name: "Jun", income: 14235, expenses: 8426 },
];

export default function BankAccountOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {metric.change > 0 ? "+" : ""}
                {metric.change}% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>
            Monthly comparison for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Bar
                dataKey="income"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </div>
  );
}
