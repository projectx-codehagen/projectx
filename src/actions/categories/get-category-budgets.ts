"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getCategoryBudgetsSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
});

export async function getCategoryBudgets(
  input: z.infer<typeof getCategoryBudgetsSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getCategoryBudgetsSchema.parse(input);

    const categoryBudgets = await prisma.categoryBudget.findMany({
      where: {
        categoryId: validatedFields.categoryId,
        category: {
          userId,
        },
      },
      include: {
        budget: true,
        category: true,
      },
      orderBy: {
        budget: {
          startDate: "desc",
        },
      },
    });

    return { success: true, categoryBudgets };
  } catch (error) {
    console.error("Error in getCategoryBudgets:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching category budgets",
    };
  }
}
