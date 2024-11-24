import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const goals = [
  { name: "Emergency Fund", current: 10000, target: 15000, progress: 66 },
  { name: "Vacation", current: 2000, target: 5000, progress: 40 },
  { name: "New Car", current: 5000, target: 20000, progress: 25 },
];

export function SavingsGoals() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{goal.name}</span>
              <span className="text-sm text-muted-foreground">
                ${goal.current.toLocaleString()} / $
                {goal.target.toLocaleString()}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-[hsl(var(--chart-2))] w-[${goal.progress}%]`}
              />
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {goal.progress}% Complete
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
