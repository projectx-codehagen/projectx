"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const createBudgetSchema = z.object({
  name: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  amount: z.string().min(1, "Amount is required"),
  categories: z.array(
    z.object({
      categoryId: z.string(),
      amount: z.string().min(1, "Category amount is required"),
    })
  ),
});

export async function createBudget(input: z.infer<typeof createBudgetSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createBudgetSchema.parse(input);
    const amount = new Prisma.Decimal(validatedFields.amount);

    // Create budget with categories
    const budget = await prisma.budget.create({
      data: {
        name: validatedFields.name,
        startDate: validatedFields.startDate,
        endDate: validatedFields.endDate,
        amount,
        userId,
        categories: {
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
    console.error("Error in createBudget:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the budget",
    };
  }
}
