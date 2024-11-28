"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CATEGORIES } from "@/lib/config/categories";

interface CategoryOverview {
  totalSpending: number;
  categoryBreakdown: {
    name: string;
    amount: number;
    budget: number;
    color: string;
    percentage: number;
    progress: number;
  }[];
  recentTransactions: {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: Date;
    icon: string;
    color: string;
  }[];
  monthlySpending: {
    date: string;
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
    entertainment: number;
    healthcare: number;
    other: number;
  }[];
}

export async function getCategoriesOverview(): Promise<{
  success: boolean;
  data?: CategoryOverview & { hasBudget: boolean };
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Check if user has any budget
    const existingBudget = await prisma.budget.findFirst({
      where: { userId },
    });

    // Get all categories with their transactions and budgets
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        budgets: {
          include: {
            budget: true,
          },
        },
      },
    });

    // Calculate total spending
    const totalSpending = categories.reduce(
      (sum, category) =>
        sum +
        category.transactions.reduce(
          (catSum, tx) => catSum + tx.amount.toNumber(),
          0
        ),
      0
    );

    // Calculate category breakdown
    const categoryBreakdown = categories.map((category) => {
      const amount = category.transactions.reduce(
        (sum, tx) => sum + tx.amount.toNumber(),
        0
      );
      const budget = category.budgets[0]?.amount.toNumber() || 0;

      // Calculate percentage of total spending (0 if no spending)
      const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;

      // Calculate progress towards budget (0 if no budget)
      const progress = budget > 0 ? (amount / budget) * 100 : 0;

      // Find matching category from our config to get the correct color
      const configCategory = CATEGORIES.find(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      );

      return {
        name: category.name,
        amount,
        budget,
        color: configCategory?.color || "hsl(var(--chart-10))", // Use color from config or default to "other" color
        percentage,
        progress,
      };
    });

    // Get recent transactions
    const recentTransactions = categories
      .flatMap((category) => {
        // Find matching category from config
        const configCategory = CATEGORIES.find(
          (c) => c.name.toLowerCase() === category.name.toLowerCase()
        );

        return category.transactions.map((tx) => ({
          id: tx.id,
          name: tx.description,
          category: category.name,
          amount: tx.amount.toNumber(),
          date: tx.date,
          icon: configCategory?.id || "other",
          color: configCategory?.color || "hsl(var(--chart-10))",
        }));
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate monthly spending
    const monthlySpending = await calculateMonthlySpending(categories);

    return {
      success: true,
      data: {
        totalSpending,
        categoryBreakdown,
        recentTransactions,
        monthlySpending,
        hasBudget: !!existingBudget,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch categories overview",
    };
  }
}

async function calculateMonthlySpending(categories: any[]) {
  const monthlyData: Record<string, Record<string, number>> = {};

  // Use category names from our config for defaults
  const defaultCategories = Object.fromEntries(
    CATEGORIES.map((cat) => [cat.name, 0])
  );

  categories.forEach((category) => {
    category.transactions.forEach((tx: any) => {
      const date = tx.date.toISOString().split("T")[0].slice(0, 7);
      if (!monthlyData[date]) {
        monthlyData[date] = { ...defaultCategories };
      }

      const standardName = mapCategoryToStandard(category);
      if (standardName) {
        monthlyData[date][standardName] =
          (monthlyData[date][standardName] || 0) + tx.amount.toNumber();
      }
    });
  });

  return Object.entries(monthlyData)
    .map(([date, values]) => ({
      date,
      ...defaultCategories,
      ...values,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mapCategoryToStandard(category: {
  name: string;
  icon: string;
}): string {
  // Find matching category from our config
  const matchingCategory = CATEGORIES.find(
    (c) => c.name.toLowerCase() === category.name.toLowerCase()
  );

  return matchingCategory?.name || "Other";
}
