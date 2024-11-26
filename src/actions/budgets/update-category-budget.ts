"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateCategoryBudgetSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  monthlyLimit: z.string().min(1, "Monthly limit is required"),
  description: z.string().optional(),
});

export async function updateCategoryBudget(
  input: z.infer<typeof updateCategoryBudgetSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateCategoryBudgetSchema.parse(input);

    // Verify category ownership
    const category = await prisma.category.findFirst({
      where: {
        id: validatedFields.categoryId,
        userId,
      },
      include: {
        budgets: {
          include: {
            budget: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found or unauthorized");
    }

    // Create or update budget
    const budget = await prisma.budget.upsert({
      where: {
        id: category.budgets[0]?.budgetId || "new",
      },
      create: {
        userId,
        amount: new Prisma.Decimal(validatedFields.monthlyLimit),
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        categories: {
          create: {
            amount: new Prisma.Decimal(validatedFields.monthlyLimit),
            category: {
              connect: { id: validatedFields.categoryId },
            },
          },
        },
      },
      update: {
        amount: new Prisma.Decimal(validatedFields.monthlyLimit),
        categories: {
          update: {
            where: {
              budgetId_categoryId: {
                budgetId: category.budgets[0].budgetId,
                categoryId: validatedFields.categoryId,
              },
            },
            data: {
              amount: new Prisma.Decimal(validatedFields.monthlyLimit),
            },
          },
        },
      },
    });

    revalidatePath("/categories");
    return { success: true, budget };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the budget",
    };
  }
}
