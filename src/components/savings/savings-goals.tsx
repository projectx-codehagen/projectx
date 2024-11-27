"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Wallet, Home } from "lucide-react";

interface SavingsGoalsProps {
  data: {
    name: string;
    current: number;
    target: number;
    progress: number;
    deadline?: Date;
  }[];
}

const iconMap = {
  "Emergency Fund": PiggyBank,
  Retirement: Wallet,
  "House Down Payment": Home,
};

export function SavingsGoals({ data }: SavingsGoalsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((goal) => {
          const Icon = iconMap[goal.name as keyof typeof iconMap] || PiggyBank;
          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm">{goal.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ${goal.current.toLocaleString()} / $
                  {goal.target.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    goal.progress >= 100
                      ? "bg-green-500"
                      : "bg-[hsl(var(--primary))]"
                  }`}
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {goal.progress.toFixed(1)}% Complete
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
