import { getCurrentUser } from "@/actions/user/get-current-user";
import { getInvestmentsOverview } from "@/actions/investments/get-investments-overview";
import { PortfolioAllocation } from "@/components/investments/portfolio-allocation";
import { PositionsTable } from "@/components/investments/positions-table";
import { AddInvestmentComponent } from "@/components/investments/add-investment";
import { StockCards } from "@/components/stock-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceChart } from "@/components/investments/balance-chart";
import { TrendingUp, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

export default async function InvestmentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getInvestmentsOverview();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your investments</h2>
        <AddInvestmentComponent />
      </div>

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
                  ${(data?.totalInvestments || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> vs last month
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart data={data?.monthlyTrend} type="total" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Portfolio overview</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stocks & ETFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${(data?.totalStocks || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> this month
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart data={data?.monthlyTrend} type="stocks" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Stock market performance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crypto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">
                  ${(data?.totalCrypto || 0).toLocaleString()}
                  <span className="text-xl">.00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+$0 (0%)</span> this month
                </p>
              </div>
              <div className="h-[180px]">
                <BalanceChart data={data?.monthlyTrend} type="crypto" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>Crypto performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data?.investmentAllocation && data.investmentAllocation.length > 0 ? (
        <StockCards data={data.investmentAllocation} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={Wallet} />
          <EmptyPlaceholder.Title>No investments yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Add your first investment to see it here.
          </EmptyPlaceholder.Description>
          <AddInvestmentComponent />
        </EmptyPlaceholder>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.investmentAllocation && data.investmentAllocation.length > 0 ? (
          <PortfolioAllocation data={data.investmentAllocation} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={TrendingUp} />
                <EmptyPlaceholder.Title>
                  No allocation data
                </EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                  Add investments to see your portfolio breakdown.
                </EmptyPlaceholder.Description>
              </EmptyPlaceholder>
            </CardContent>
          </Card>
        )}

        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
          <PositionsTable data={data.recentTransactions} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyPlaceholder>
                <EmptyPlaceholder.Icon icon={TrendingUp} />
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
