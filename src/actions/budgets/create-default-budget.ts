"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const defaultCategoryBudgets = {
  Housing: 2000,
  Food: 800,
  Transport: 400,
  Utilities: 300,
  Entertainment: 200,
  Healthcare: 300,
  Other: 200,
};

export async function createDefaultBudget() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Create categories if they don't exist
    for (const [name, amount] of Object.entries(defaultCategoryBudgets)) {
      const category = await prisma.category.upsert({
        where: {
          name_userId: {
            name,
            userId,
          },
        },
        create: {
          name,
          icon: name,
          userId,
        },
        update: {},
      });

      // Create or update budget for this category
      await prisma.budget.upsert({
        where: {
          id: `default-${userId}`,
        },
        create: {
          userId,
          amount: new Prisma.Decimal(amount),
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          categories: {
            create: {
              amount: new Prisma.Decimal(amount),
              category: {
                connect: { id: category.id },
              },
            },
          },
        },
        update: {
          categories: {
            upsert: {
              where: {
                budgetId_categoryId: {
                  budgetId: `default-${userId}`,
                  categoryId: category.id,
                },
              },
              create: {
                amount: new Prisma.Decimal(amount),
                category: {
                  connect: { id: category.id },
                },
              },
              update: {
                amount: new Prisma.Decimal(amount),
              },
            },
          },
        },
      });
    }

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error in createDefaultBudget:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the default budget",
    };
  }
}
