"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

interface InvestmentOverview {
  totalInvestments: number;
  totalStocks: number;
  totalCrypto: number;
  investmentAllocation: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    shares: number | null;
    price: number;
    date: Date;
    description: string;
    investment: {
      id: string;
      name: string;
      type: string;
      amount: number;
      shares: number | null;
      purchasePrice: number | null;
      currentPrice: number | null;
    };
  }[];
  monthlyTrend: {
    date: string;
    total: number;
    stocks: number;
    crypto: number;
    other: number;
  }[];
}

const investmentTypeDisplayNames: Record<string, string> = {
  STOCKS: "Stocks",
  CRYPTO: "Crypto",
  ETF: "ETF",
  OTHER: "Other",
};

export async function getInvestmentsOverview(): Promise<{
  success: boolean;
  data?: InvestmentOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get all investments with their valuations and transactions
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: {
        valuations: {
          orderBy: { date: "desc" },
          take: 1,
        },
        transactions: {
          orderBy: { date: "desc" },
        },
      },
    });

    // Calculate totals
    const totalInvestments = investments.reduce(
      (sum, investment) => sum + investment.amount.toNumber(),
      0
    );

    const totalStocks = investments
      .filter((investment) => ["STOCKS", "ETF"].includes(investment.type))
      .reduce((sum, investment) => sum + investment.amount.toNumber(), 0);

    const totalCrypto = investments
      .filter((investment) => investment.type === "CRYPTO")
      .reduce((sum, investment) => sum + investment.amount.toNumber(), 0);

    // Calculate investment allocation
    const investmentAllocation = Object.entries(
      investments.reduce((acc, investment) => {
        const type = investment.type;
        acc[type] = (acc[type] || 0) + investment.amount.toNumber();
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({
      name: investmentTypeDisplayNames[name] || name,
      originalName: name,
      value,
      percentage: (value / totalInvestments) * 100,
      progress: `w-[${((value / totalInvestments) * 100).toFixed(1)}%]`,
    }));

    // Get recent transactions
    const recentTransactions = investments
      .flatMap((investment) =>
        investment.transactions.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount.toNumber(),
          shares: tx.shares?.toNumber() || null,
          price: tx.price.toNumber(),
          date: tx.date,
          description: tx.description || "",
          investment: {
            id: investment.id,
            name: investment.name,
            type: investment.type,
            amount: investment.amount.toNumber(),
            shares: investment.shares?.toNumber() || null,
            purchasePrice: investment.purchasePrice?.toNumber() || null,
            currentPrice: investment.currentPrice?.toNumber() || null,
          },
        }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate monthly trend
    const valuations = await prisma.investmentValuation.findMany({
      where: {
        investment: {
          userId,
        },
        date: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      include: {
        investment: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const trendMap = new Map<
      string,
      { total: number; stocks: number; crypto: number; other: number }
    >();

    valuations.forEach((valuation) => {
      const date = valuation.date.toISOString().split("T")[0];
      const value = valuation.value.toNumber();
      const current = trendMap.get(date) || {
        total: 0,
        stocks: 0,
        crypto: 0,
        other: 0,
      };

      current.total += value;
      if (["STOCKS", "ETF"].includes(valuation.investment.type)) {
        current.stocks += value;
      } else if (valuation.investment.type === "CRYPTO") {
        current.crypto += value;
      } else {
        current.other += value;
      }

      trendMap.set(date, current);
    });

    const trend = Array.from(trendMap.entries())
      .map(([date, values]) => ({
        date,
        ...values,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      success: true,
      data: {
        totalInvestments,
        totalStocks,
        totalCrypto,
        investmentAllocation,
        recentTransactions,
        monthlyTrend: trend,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch investments overview",
    };
  }
}
