"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

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
  data?: CategoryOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

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

      return {
        name: category.name,
        amount,
        budget,
        color: `hsl(var(--chart-${categories.indexOf(category) + 1}))`,
        percentage,
        progress,
      };
    });

    // Get recent transactions
    const recentTransactions = categories
      .flatMap((category) =>
        category.transactions.map((tx) => ({
          id: tx.id,
          name: tx.description,
          category: category.name,
          amount: tx.amount.toNumber(),
          date: tx.date,
          icon: category.icon,
          color: `hsl(var(--chart-${categories.indexOf(category) + 1}))`,
        }))
      )
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
  const defaultCategories = {
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    entertainment: 0,
    healthcare: 0,
    other: 0,
  };

  categories.forEach((category) => {
    category.transactions.forEach((tx: any) => {
      const date = tx.date.toISOString().split("T")[0].slice(0, 7); // YYYY-MM
      if (!monthlyData[date]) {
        monthlyData[date] = { ...defaultCategories };
      }
      // Map category name to our standard categories, defaulting to 'other'
      const categoryKey = mapCategoryToStandard(category.name);
      monthlyData[date][categoryKey] =
        (monthlyData[date][categoryKey] || 0) + tx.amount.toNumber();
    });
  });

  return Object.entries(monthlyData)
    .map(([date, values]) => ({
      date,
      ...defaultCategories, // Ensure all categories exist
      ...values, // Override with actual values
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mapCategoryToStandard(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (
    name.includes("hous") ||
    name.includes("rent") ||
    name.includes("mortgage")
  )
    return "housing";
  if (
    name.includes("food") ||
    name.includes("grocery") ||
    name.includes("restaurant")
  )
    return "food";
  if (
    name.includes("transport") ||
    name.includes("car") ||
    name.includes("gas")
  )
    return "transportation";
  if (
    name.includes("util") ||
    name.includes("electric") ||
    name.includes("water")
  )
    return "utilities";
  if (
    name.includes("entertain") ||
    name.includes("fun") ||
    name.includes("hobby")
  )
    return "entertainment";
  if (
    name.includes("health") ||
    name.includes("medical") ||
    name.includes("doctor")
  )
    return "healthcare";
  return "other";
}
