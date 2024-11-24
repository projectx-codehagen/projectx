import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, PiggyBank } from "lucide-react";

export function SavingsOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-2xl font-bold">
              $25,000<span className="text-xl">.00</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+$1,200 (+5.2%)</span> vs last
              month
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Goal Progress</span>
            <span className="font-medium">65%</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Monthly Rate</span>
            </div>
            <div className="text-sm font-medium">$1,200</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Emergency Fund</span>
            </div>
            <div className="text-sm font-medium">$10,000</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
