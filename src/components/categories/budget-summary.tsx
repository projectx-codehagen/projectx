import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const totalProgress =
    totalBudget > 0 ? (Math.abs(data.totalSpending) / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - Math.abs(data.totalSpending);

  // Find biggest category (by absolute amount)
  const biggestCategory = data.categoryBreakdown.reduce(
    (max, cat) =>
      Math.abs(cat.amount) > Math.abs(max?.amount || 0) ? cat : max,
    data.categoryBreakdown[0]
  );

  // Calculate daily average
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const currentDay = today.getDate();
  const dailyAverage = Math.abs(data.totalSpending) / currentDay;
  const dailyTarget = totalBudget / daysInMonth;
  const dailyDifference = dailyTarget - dailyAverage;

  const formatAmount = (amount: number) => {
    const [dollars, cents] = amount.toFixed(2).split(".");
    return (
      <>
        ${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        <span className="text-xl">.{cents}</span>
      </>
    );
  };

  const summary = [
    {
      title: "Monthly Budget",
      amount: Math.abs(data.totalSpending),
      total: totalBudget,
      icon: TrendingDown,
      change:
        totalBudget > 0
          ? `$${remainingBudget.toLocaleString()} (${(
              100 - totalProgress
            ).toFixed(1)}% remaining)`
          : "No budget set",
      progress: totalProgress,
      description: "of budget used this month",
    },
    {
      title: "Biggest Category",
      amount: Math.abs(biggestCategory?.amount || 0),
      category: biggestCategory?.name || "None",
      icon: TrendingUp,
      change: biggestCategory
        ? `${Math.abs(biggestCategory.percentage).toFixed(
            1
          )}% of total spending`
        : "No spending yet",
      progress: Math.abs(biggestCategory?.progress || 0),
      description: "of category budget",
    },
    {
      title: "Daily Average",
      amount: dailyAverage,
      icon: AlertCircle,
      change:
        dailyTarget > 0
          ? `$${Math.abs(dailyDifference).toFixed(0)} ${
              dailyDifference >= 0 ? "under" : "over"
            } daily target`
          : "No daily target set",
      progress: dailyTarget > 0 ? (dailyAverage / dailyTarget) * 100 : 0,
      description: "of daily target",
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {summary.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  {formatAmount(item.amount)}
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
                    {Math.abs(item.progress).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(Math.abs(item.progress), 100)}
                  className="h-2"
                />
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
