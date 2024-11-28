"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CATEGORIES } from "@/lib/config/categories";

export async function createDefaultBudget() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Create or update categories using our standard config
    const categories = await Promise.all(
      CATEGORIES.filter((cat) => cat.type === "DEBIT").map(async (category) => {
        return prisma.category.upsert({
          where: {
            name_userId: {
              name: category.name,
              userId,
            },
          },
          update: {}, // No updates needed if exists
          create: {
            name: category.name,
            icon: category.id,
            userId,
          },
        });
      })
    );

    // Create default budget with these categories
    const budget = await prisma.budget.create({
      data: {
        name: "Default Budget",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        amount: 5000,
        userId,
        categories: {
          create: categories.map((cat) => ({
            amount: getDefaultBudgetAmount(cat.name),
            category: {
              connect: { id: cat.id },
            },
          })),
        },
      },
    });

    revalidatePath("/categories");
    return { success: true, budget };
  } catch (error) {
    console.error("Error in createDefaultBudget:", error);
    return { success: false, error: "Failed to create default budget" };
  }
}

// Helper function to get default budget amounts
function getDefaultBudgetAmount(categoryName: string): number {
  const defaultAmounts: Record<string, number> = {
    Housing: 2000,
    "Food": 800,
    Transportation: 400,
    Utilities: 300,
    Entertainment: 200,
    Healthcare: 300,
    Shopping: 400,
    Travel: 200,
    Subscriptions: 100,
    Other: 300,
  };

  return defaultAmounts[categoryName] || 200;
}
