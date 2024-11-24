"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceChart } from "./balance-chart";
import { StockCards } from "./stock-cards";
import { PortfolioAllocation } from "./portfolio-allocation";
import { PositionsTable } from "./positions-table";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-8 bg-black min-h-screen">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-normal">
              Total balance
            </CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-medium">$10,241</span>
              <span className="text-sm text-zinc-400">
                you have gained 4.7% last month
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <BalanceChart />
          </CardContent>
        </Card>
        <Card className="bg-zinc-950 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                AI
              </div>
              <div>
                <p className="text-sm text-zinc-400">2 months ago</p>
                <h2 className="text-xl">Apple Inc.</h2>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500">
                ▲ 12.00%
              </div>
              <p className="text-2xl mt-2">$10,400.00</p>
              <p className="text-sm text-zinc-400">Updated at 23:03</p>
            </div>
          </CardHeader>
          <CardContent>
            <BalanceChart variant="secondary" />
          </CardContent>
        </Card>
      </div>
      <StockCards />
      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioAllocation />
        <PositionsTable />
      </div>
    </div>
  );
}
