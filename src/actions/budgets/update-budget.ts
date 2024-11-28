"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateBudgetSchema = z.object({
  id: z.string().min(1, "Budget ID is required"),
  name: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  amount: z.string().min(1, "Amount is required"),
  categories: z.array(
    z.object({
      id: z.string().optional(),
      categoryId: z.string(),
      amount: z.string().min(1, "Category amount is required"),
    })
  ),
});

export async function updateBudget(input: z.infer<typeof updateBudgetSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateBudgetSchema.parse(input);

    // Verify budget ownership
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
      include: {
        categories: true,
      },
    });

    if (!existingBudget) {
      throw new Error("Budget not found or unauthorized");
    }

    const amount = new Prisma.Decimal(validatedFields.amount);

    // Update budget and handle category relationships
    const budget = await prisma.budget.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        startDate: validatedFields.startDate,
        endDate: validatedFields.endDate,
        amount,
        categories: {
          deleteMany: {}, // Remove existing relationships
          create: validatedFields.categories.map((cat) => ({
            amount: new Prisma.Decimal(cat.amount),
            category: {
              connect: { id: cat.categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    revalidatePath("/categories");
    return { success: true, budget };
  } catch (error) {
    console.error("Error in updateBudget:", error);
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
