import { BalanceChart } from "@/components/investments/balance-chart";
import { PortfolioAllocation } from "@/components/investments/portfolio-allocation";
import { PositionsTable } from "@/components/investments/positions-table";
import { StockCards } from "@/components/stock-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function InvestmentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $6,984.00<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$174.60 (+2.5%)</span> vs
                  last month
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Portfolio is up 2.5% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $320.00<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$39.68 (+12.4%)</span> this
                  month
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart variant="secondary" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Best performing asset this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  $84.35<span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$1.01 (+1.2%)</span> today
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Market is up 1.2% today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StockCards />

      <div className="grid gap-4 md:grid-cols-2">
        <PortfolioAllocation />
        <PositionsTable />
      </div>
    </div>
  );
}
