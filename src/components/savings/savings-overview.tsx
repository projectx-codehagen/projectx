"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, PiggyBank } from "lucide-react";

interface SavingsOverviewProps {
  data: {
    totalSavings: number;
    monthlyChange: number;
    monthlyChangePercentage: number;
    savingsGoals: {
      name: string;
      current: number;
      target: number;
      progress: number;
    }[];
  };
}

export function SavingsOverview({ data }: SavingsOverviewProps) {
  // Find emergency fund goal
  const emergencyFund = data.savingsGoals.find(
    (goal) => goal.name === "Emergency Fund"
  );

  // Calculate overall progress
  const totalTarget = data.savingsGoals.reduce(
    (sum, goal) => sum + goal.target,
    0
  );
  const overallProgress =
    totalTarget > 0 ? (data.totalSavings / totalTarget) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-2xl font-bold">
              ${data.totalSavings.toLocaleString()}
              <span className="text-xl">.00</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  data.monthlyChange >= 0
                    ? "text-green-500"
                    : "text-destructive"
                }
              >
                {data.monthlyChange >= 0 ? "+" : ""}$
                {Math.abs(data.monthlyChange).toLocaleString()} (
                {data.monthlyChangePercentage.toFixed(1)}%)
              </span>{" "}
              vs last month
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                overallProgress >= 100
                  ? "bg-green-500"
                  : "bg-[hsl(var(--primary))]"
              }`}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Monthly Rate</span>
            </div>
            <div className="text-sm font-medium">
              ${Math.abs(data.monthlyChange).toLocaleString()}
            </div>
          </div>

          {emergencyFund && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Emergency Fund</span>
              </div>
              <div className="text-sm font-medium">
                ${emergencyFund.current.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">
                  / ${emergencyFund.target.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
