"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CATEGORIES } from "@/lib/config/categories";

interface DashboardOverview {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyChange: number;
  monthlyChangePercentage: number;
  recentTransactions: {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: Date;
    icon: string;
    color: string;
  }[];
  topCategories: {
    name: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
  monthlyTrend: {
    date: string;
    income: number;
    expenses: number;
    balance: number;
  }[];
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
    lastTransaction?: {
      amount: number;
      date: Date;
      description: string;
    };
  }[];
}

export async function getDashboardOverview(): Promise<{
  success: boolean;
  data?: DashboardOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get all accounts with their balances and transactions
    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      include: {
        Balance: {
          orderBy: { date: "desc" },
          take: 1,
        },
        Transaction: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    // Calculate total balance
    const totalBalance = accounts.reduce(
      (sum, account) => sum + (account.Balance[0]?.amount || 0),
      0
    );

    // Get recent transactions with categories
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accounts.map((acc) => acc.id) },
        date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
      },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
      take: 5,
    });

    // Calculate monthly income and expenses
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        accountId: { in: accounts.map((acc) => acc.id) },
        date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
      },
    });

    const monthlyIncome = monthlyTransactions
      .filter((tx) => tx.type === "CREDIT")
      .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((tx) => tx.type === "DEBIT")
      .reduce((sum, tx) => sum + Math.abs(tx.amount.toNumber()), 0);

    // Calculate top spending categories
    const categoryTotals = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        accountId: { in: accounts.map((acc) => acc.id) },
        date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
        type: "DEBIT",
      },
      _sum: {
        amount: true,
      },
    });

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryTotals
            .map((cat) => cat.categoryId)
            .filter(Boolean) as string[],
        },
      },
    });

    const topCategories = categoryTotals
      .filter((cat) => cat.categoryId && cat._sum.amount)
      .map((cat) => {
        const category = categories.find((c) => c.id === cat.categoryId);
        const configCategory = CATEGORIES.find(
          (c) => c.name.toLowerCase() === category?.name.toLowerCase()
        );
        return {
          name: category?.name || "Other",
          amount: Math.abs(cat._sum.amount?.toNumber() || 0),
          color: configCategory?.color || "hsl(var(--chart-10))",
          percentage:
            (Math.abs(cat._sum.amount?.toNumber() || 0) / monthlyExpenses) *
            100,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Format accounts data
    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.accountType,
      balance: account.Balance[0]?.amount || 0,
      lastTransaction: account.Transaction[0]
        ? {
            amount: account.Transaction[0].amount.toNumber(),
            date: account.Transaction[0].date,
            description: account.Transaction[0].description,
          }
        : undefined,
    }));

    // Format recent transactions
    const formattedTransactions = recentTransactions.map((tx) => {
      const configCategory = CATEGORIES.find(
        (c) => c.name.toLowerCase() === tx.category?.name.toLowerCase()
      );
      return {
        id: tx.id,
        name: tx.description,
        category: tx.category?.name || "Other",
        amount: tx.amount.toNumber(),
        date: tx.date,
        icon: configCategory?.id || "other",
        color: configCategory?.color || "hsl(var(--chart-10))",
      };
    });

    return {
      success: true,
      data: {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlyChange: monthlyIncome - monthlyExpenses,
        monthlyChangePercentage:
          monthlyExpenses > 0
            ? ((monthlyIncome - monthlyExpenses) / monthlyExpenses) * 100
            : 0,
        recentTransactions: formattedTransactions,
        topCategories,
        monthlyTrend: [], // TODO: Implement monthly trend calculation
        accounts: formattedAccounts,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardOverview:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard overview",
    };
  }
}
