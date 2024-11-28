"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getBudgetProgressSchema = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export async function getBudgetProgress(
  input: z.infer<typeof getBudgetProgressSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getBudgetProgressSchema.parse(input);

    const budget = await prisma.budget.findFirst({
      where: {
        id: validatedFields.budgetId,
        userId,
      },
      include: {
        categories: {
          include: {
            category: {
              include: {
                transactions: {
                  where: {
                    date: {
                      gte: validatedFields.startDate || new Date(),
                      lte: validatedFields.endDate || undefined,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!budget) {
      throw new Error("Budget not found or unauthorized");
    }

    // Calculate overall budget progress
    const totalBudget = budget.amount?.toNumber() || 0;
    const totalSpent = budget.categories.reduce(
      (sum, cat) =>
        sum +
        cat.category.transactions.reduce(
          (catSum, tx) => catSum + tx.amount.toNumber(),
          0
        ),
      0
    );

    // Calculate progress by category
    const categoryProgress = budget.categories.map((cat) => {
      const spent = cat.category.transactions.reduce(
        (sum, tx) => sum + tx.amount.toNumber(),
        0
      );
      return {
        categoryId: cat.categoryId,
        categoryName: cat.category.name,
        budgeted: cat.amount.toNumber(),
        spent,
        remaining: cat.amount.toNumber() - spent,
        progress: ((spent / cat.amount.toNumber()) * 100).toFixed(1),
      };
    });

    const progress = {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overallProgress: ((totalSpent / totalBudget) * 100).toFixed(1),
      categories: categoryProgress,
      startDate: budget.startDate,
      endDate: budget.endDate,
      daysRemaining: Math.ceil(
        ((budget.endDate?.getTime() ?? 0) - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };

    return { success: true, progress };
  } catch (error) {
    console.error("Error in getBudgetProgress:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching budget progress",
    };
  }
}
