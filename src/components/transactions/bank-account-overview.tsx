"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BankAccountChart } from "@/components/banking/bank-account-chart";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface BankAccountOverviewProps {
  data: {
    totalBalance: number;
    monthlyChange: number;
    monthlyChangePercentage: number;
    monthlyTrend: {
      date: string;
      total: number;
      checking: number;
      savings: number;
    }[];
  };
}

export default function BankAccountOverview({
  data,
}: BankAccountOverviewProps) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold">
                ${data.totalBalance.toLocaleString()}
                <span className="text-xl">.00</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    data.monthlyChange >= 0
                      ? "text-green-500"
                      : "text-destructive"
                  }
                >
                  {data.monthlyChange >= 0 ? "+" : ""}$
                  {Math.abs(data.monthlyChange).toLocaleString()} (
                  {data.monthlyChangePercentage.toFixed(1)}%)
                </span>{" "}
                vs last month
              </p>
            </div>
            <div className="h-[180px]">
              <BankAccountChart data={data.monthlyTrend} type="total" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>Account overview</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold">
                $
                {data.monthlyTrend[
                  data.monthlyTrend.length - 1
                ]?.checking.toLocaleString()}
                <span className="text-xl">.00</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+$0 (0%)</span> this month
              </p>
            </div>
            <div className="h-[180px]">
              <BankAccountChart data={data.monthlyTrend} type="checking" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 text-green-500" />
              <span>Checking accounts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold">
                $
                {data.monthlyTrend[
                  data.monthlyTrend.length - 1
                ]?.savings.toLocaleString()}
                <span className="text-xl">.00</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+$0 (0%)</span> this month
              </p>
            </div>
            <div className="h-[180px]">
              <BankAccountChart data={data.monthlyTrend} type="savings" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wallet className="h-3.5 w-3.5 text-green-500" />
              <span>Savings accounts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
