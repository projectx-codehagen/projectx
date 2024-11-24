import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const summary = [
  {
    title: "Monthly Budget",
    amount: 3200,
    spent: 2350,
    icon: TrendingDown,
    change: "-$850 (26.5% remaining)",
    progress: 73.5,
    description: "of budget used this month",
  },
  {
    title: "Biggest Category",
    amount: 1500,
    category: "Housing",
    icon: TrendingUp,
    change: "+$50 vs last month",
    progress: 46.8,
    description: "of total spending",
  },
  {
    title: "Daily Average",
    amount: 78.33,
    icon: AlertCircle,
    change: "-$12 vs last month",
    progress: 85,
    description: "of daily target",
  },
];

export function BudgetSummary() {
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
                  ${item.amount.toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{item.change}</span>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{item.progress}%</span>
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
