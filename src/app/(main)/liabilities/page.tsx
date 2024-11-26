import { getCurrentUser } from "@/actions/user/get-current-user";
import { getLiabilitiesOverview } from "@/actions/liabilities/get-liabilities-overview";
import { LiabilityAllocation } from "@/components/liabilities/liability-allocation";
import { LiabilityCards } from "@/components/liabilities/liability-cards";
import { LiabilityTable } from "@/components/liabilities/liability-table";
import { AddLiabilityComponent } from "@/components/liabilities/add-liability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalLiabilitiesChart } from "@/components/liabilities/total-liabilities-chart";
import { TrendingDown, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

export default async function LiabilitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getLiabilitiesOverview();
  console.log(data);

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
                  ${(data?.totalLiabilities || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-$0 (0%)</span> vs last month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart data={data?.monthlyTrend} type="total" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                <span>Total debt overview</span>
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
                  ${(data?.monthlyPayments || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-$0 (0%)</span> this month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart
                  data={data?.monthlyTrend}
                  type="mortgage"
                />
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
                  {(data?.debtToIncome || 0).toFixed(1)}
                  <span className="text-xl">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-0.5% points</span> this
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalLiabilitiesChart data={data?.monthlyTrend} type="other" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                <span>Healthy ratio is below 36%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data?.liabilityAllocation && data.liabilityAllocation.length > 0 ? (
        <LiabilityCards data={data.liabilityAllocation} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={Wallet} />
          <EmptyPlaceholder.Title>No liabilities yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add your first liability to see it here.
          </EmptyPlaceholder.Description>
          <AddLiabilityComponent />
        </EmptyPlaceholder>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.liabilityAllocation && data.liabilityAllocation.length > 0 ? (
          <LiabilityAllocation data={data.liabilityAllocation} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Liability Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={TrendingDown} />
                <EmptyPlaceholder.Title>
                  No liabilities data
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add liabilities to see your debt breakdown.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}

        {data?.recentPayments && data.recentPayments.length > 0 ? (
          <LiabilityTable data={data.recentPayments} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={TrendingDown} />
                <EmptyPlaceholder.Title>No payments yet</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Payments will appear here as you add them.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
