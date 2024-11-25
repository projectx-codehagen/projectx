"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getCategories() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
        transactions: {
          select: {
            amount: true,
          },
        },
        budgets: {
          include: {
            budget: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Calculate totals and transform data
    const categoriesWithTotals = categories.map((category) => ({
      ...category,
      transactionCount: category._count.transactions,
      total: category.transactions.reduce(
        (sum, transaction) => sum + transaction.amount.toNumber(),
        0
      ),
      _count: undefined,
      transactions: undefined,
    }));

    return { success: true, categories: categoriesWithTotals };
  } catch (error) {
    console.error("Error in getCategories:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching categories",
    };
  }
}
