"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { AccountType } from "@prisma/client";

interface BankingOverview {
  totalBalance: number;
  monthlyChange: number;
  monthlyChangePercentage: number;
  bankAccounts: {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
    percentage: number;
    accountNumber?: string;
    lastTransaction?: {
      amount: number;
      date: Date;
      description: string;
    };
  }[];
  recentTransactions: {
    id: string;
    amount: number;
    date: Date;
    description: string;
    accountName: string;
    accountId: string;
  }[];
  monthlyTrend: {
    date: string;
    total: number;
    checking: number;
    savings: number;
  }[];
}

export async function getBankingOverview(): Promise<{
  success: boolean;
  data?: BankingOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get all bank accounts with their balances and transactions
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { userId },
      include: {
        Balance: {
          orderBy: { date: "desc" },
          take: 1,
        },
        Transaction: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
      orderBy: { name: "asc" },
    });

    // Calculate total balance
    const totalBalance = bankAccounts.reduce(
      (sum, account) => sum + (account.Balance[0]?.amount || 0),
      0
    );

    // Calculate monthly change
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const [currentBalances, lastMonthBalances] = await Promise.all([
      prisma.balance.findMany({
        where: {
          accountId: { in: bankAccounts.map((acc) => acc.id) },
          date: { gte: lastMonth },
        },
        orderBy: { date: "desc" },
      }),
      prisma.balance.findMany({
        where: {
          accountId: { in: bankAccounts.map((acc) => acc.id) },
          date: { lt: lastMonth },
        },
        orderBy: { date: "desc" },
      }),
    ]);

    const lastMonthTotal = lastMonthBalances.reduce(
      (sum, balance) => sum + (balance.amount || 0),
      0
    );

    const monthlyChange = totalBalance - lastMonthTotal;
    const monthlyChangePercentage =
      lastMonthTotal > 0 ? (monthlyChange / lastMonthTotal) * 100 : 0;

    // Format accounts data
    const formattedAccounts = bankAccounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.accountType,
      balance: account.Balance[0]?.amount || 0,
      percentage:
        totalBalance > 0
          ? ((account.Balance[0]?.amount || 0) / totalBalance) * 100
          : 0,
      accountNumber: account.originalId || undefined,
      lastTransaction: account.Transaction[0]
        ? {
            amount: Number(account.Transaction[0].amount),
            date: account.Transaction[0].date,
            description: account.Transaction[0].description,
          }
        : undefined,
    }));

    // Get recent transactions
    const recentTransactions = bankAccounts
      .flatMap((account) =>
        account.Transaction.map((tx) => ({
          id: tx.id,
          amount: tx.amount.toNumber(),
          date: tx.date,
          description: tx.description,
          accountName: account.name,
          accountId: account.id,
        }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate monthly trend
    const monthlyTrend = await calculateMonthlyTrend(bankAccounts);

    return {
      success: true,
      data: {
        totalBalance,
        monthlyChange,
        monthlyChangePercentage,
        bankAccounts: formattedAccounts,
        recentTransactions,
        monthlyTrend,
      },
    };
  } catch (error) {
    console.error("Error in getBankingOverview:", error);
    return {
      success: false,
      error: "Failed to fetch banking overview",
    };
  }
}

async function calculateMonthlyTrend(bankAccounts: any[]) {
  // Calculate trend data for the last 12 months
  const trend = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const balances = await prisma.balance.findMany({
      where: {
        accountId: { in: bankAccounts.map((acc) => acc.id) },
        date: {
          gte: date,
          lte: endDate,
        },
      },
      include: {
        bankAccount: true,
      },
    });

    const totals = balances.reduce(
      (acc, balance) => {
        const amount = balance.amount || 0;
        acc.total += amount;
        if (balance.bankAccount?.accountType === "BANK") {
          acc.checking += amount;
        } else {
          acc.savings += amount;
        }
        return acc;
      },
      { total: 0, checking: 0, savings: 0 }
    );

    trend.push({
      date: date.toISOString().split("T")[0],
      ...totals,
    });
  }

  return trend;
}
