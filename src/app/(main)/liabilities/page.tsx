import { LiabilityAllocation } from "@/components/liabilities/liability-allocation";
import { LiabilityCards } from "@/components/liabilities/liability-cards";
import { LiabilityTable } from "@/components/liabilities/liability-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalLiabilitiesChart } from "@/components/liabilities/total-liabilities-chart";
import { TrendingDown } from "lucide-react";
import { AddLiabilityComponent } from "@/components/liabilities/add-liability";

export default function LiabilitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your liabilities</h2>
        <AddLiabilityComponent />
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $450,000<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-$5,000 (-1.1%)</span> vs
                  last month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                <span>Reduced debt by $5,000 this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $2,945<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-$55 (-1.8%)</span> vs last
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart variant="secondary" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                <span>Total monthly obligations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Debt-to-Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  32<span className="text-xl">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-0.5% points</span> this
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                <span>Healthy ratio is below 36%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LiabilityCards />

      <div className="grid gap-4 md:grid-cols-2">
        <LiabilityAllocation />
        <LiabilityTable />
      </div>
    </div>
  );
}
