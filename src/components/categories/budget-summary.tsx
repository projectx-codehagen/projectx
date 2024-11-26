import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BudgetSummaryProps {
  data: {
    totalSpending: number;
    categoryBreakdown: {
      name: string;
      amount: number;
      budget: number;
      percentage: number;
      progress: number;
    }[];
  };
}

export function BudgetSummary({ data }: BudgetSummaryProps) {
  // Calculate total budget
  const totalBudget = data.categoryBreakdown.reduce(
    (sum, cat) => sum + cat.budget,
    0
  );
  const totalProgress = (data.totalSpending / totalBudget) * 100;

  // Find biggest category
  const biggestCategory = data.categoryBreakdown.reduce(
    (max, cat) => (cat.amount > (max?.amount || 0) ? cat : max),
    data.categoryBreakdown[0]
  );

  // Calculate daily average
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const dailyAverage = data.totalSpending / today.getDate();
  const dailyTarget = totalBudget / daysInMonth;
  const dailyProgress = (dailyAverage / dailyTarget) * 100;

  const summary = [
    {
      title: "Monthly Budget",
      amount: data.totalSpending,
      total: totalBudget,
      icon: TrendingDown,
      change: `-$${(totalBudget - data.totalSpending).toLocaleString()} (${(
        100 - totalProgress
      ).toFixed(1)}% remaining)`,
      progress: totalProgress,
      description: "of budget used this month",
    },
    {
      title: "Biggest Category",
      amount: biggestCategory?.amount || 0,
      category: biggestCategory?.name || "None",
      icon: TrendingUp,
      change: `${biggestCategory?.percentage.toFixed(1)}% of total spending`,
      progress: biggestCategory?.progress || 0,
      description: "of category budget",
    },
    {
      title: "Daily Average",
      amount: dailyAverage,
      icon: AlertCircle,
      change: `${dailyProgress > 100 ? "+" : "-"}$${Math.abs(
        dailyAverage - dailyTarget
      ).toFixed(0)} vs target`,
      progress: dailyProgress,
      description: "of daily target",
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {summary.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${item.amount.toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      item.progress > 100
                        ? "text-destructive"
                        : "text-green-500"
                    }
                  >
                    {item.change}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {item.progress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <item.icon className="h-3.5 w-3.5 text-green-500" />
                <span>{item.description}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
