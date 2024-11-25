import { getCurrentUser } from "@/actions/user/get-current-user";
import { getAssetsOverview } from "@/actions/assets/get-assets-overview";
import { AssetAllocation } from "@/components/assets/asset-allocation";
import { AssetCards } from "@/components/assets/asset-cards";
import { AssetTable } from "@/components/assets/asset-table";
import { AddAssetComponent } from "@/components/assets/add-asset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalAssetsChart } from "@/components/assets/total-assets-chart";
import { TrendingUp, Wallet, PieChart, Receipt } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getAssetsOverview();
  console.log(data);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your assets</h2>
        <AddAssetComponent />
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${(data?.totalAssets || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> vs last month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart data={data?.monthlyTrend} type="total" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Assets overview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquid Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${(data?.liquidAssets || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> this month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart data={data?.monthlyTrend} type="liquid" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>
                  {(
                    ((data?.liquidAssets || 0) / (data?.totalAssets || 1)) *
                    100
                  ).toFixed(1)}
                  % of total assets
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fixed Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${(data?.fixedAssets || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> this month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart data={data?.monthlyTrend} type="fixed" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>
                  {(
                    ((data?.fixedAssets || 0) / (data?.totalAssets || 1)) *
                    100
                  ).toFixed(1)}
                  % of total assets
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data?.assetAllocation && data.assetAllocation.length > 0 ? (
        <AssetCards data={data.assetAllocation} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={Wallet} />
          <EmptyPlaceholder.Title>No assets yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add your first asset to see it here.
          </EmptyPlaceholder.Description>
          <AddAssetComponent />
        </EmptyPlaceholder>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.assetAllocation && data.assetAllocation.length > 0 ? (
          <AssetAllocation data={data.assetAllocation} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={PieChart} />
                <EmptyPlaceholder.Title>
                  No allocation data
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add assets to see your allocation breakdown.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}

        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
          <AssetTable data={data.recentTransactions} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={Receipt} />
                <EmptyPlaceholder.Title>
                  No transactions yet
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Transactions will appear here as you add them.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
