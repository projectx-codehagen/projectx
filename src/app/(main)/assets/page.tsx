import { AssetAllocation } from "@/components/assets/asset-allocation";
import { AssetCards } from "@/components/assets/asset-cards";
import { AssetTable } from "@/components/assets/asset-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalAssetsChart } from "@/components/assets/total-assets-chart";
import { TrendingUp } from "lucide-react";

export default function AssetsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $1,250,000<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$50,000 (+4.2%)</span> vs
                  last month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Assets grew by $50,000 this month</span>
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
                  $415,000<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$15,000 (+3.8%)</span> this
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>33.2% of total assets</span>
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
                  $835,000<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$35,000 (+4.4%)</span> this
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <TotalAssetsChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>66.8% of total assets</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AssetCards />

      <div className="grid gap-4 md:grid-cols-2">
        <AssetAllocation />
        <AssetTable />
      </div>
    </div>
  );
}
