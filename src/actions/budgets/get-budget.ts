"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getBudgetSchema = z.object({
  id: z.string().min(1, "Budget ID is required"),
});

export async function getBudget(input: z.infer<typeof getBudgetSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getBudgetSchema.parse(input);

    const budget = await prisma.budget.findFirst({
      where: {
        id: validatedFields.id,
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
                      gte: new Date(), // Only transactions within budget period
                    },
                  },
                  select: {
                    amount: true,
                    date: true,
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

    // Calculate progress for each category
    const budgetWithProgress = {
      ...budget,
      categories: budget.categories.map((cat) => ({
        ...cat,
        spent: cat.category.transactions.reduce(
          (sum, tx) => sum + tx.amount.toNumber(),
          0
        ),
        progress: (
          (cat.category.transactions.reduce(
            (sum, tx) => sum + tx.amount.toNumber(),
            0
          ) /
            cat.amount.toNumber()) *
          100
        ).toFixed(1),
        remaining:
          cat.amount.toNumber() -
          cat.category.transactions.reduce(
            (sum, tx) => sum + tx.amount.toNumber(),
            0
          ),
      })),
    };

    return { success: true, budget: budgetWithProgress };
  } catch (error) {
    console.error("Error in getBudget:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the budget",
    };
  }
}
