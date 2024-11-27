"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ensureDefaultCategories } from "@/lib/utils/transaction-categorization";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export async function getCategories(): Promise<{
  success: boolean;
  data?: Category[];
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const categories = await prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        icon: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
    };
  }
}

export async function updateTransactionCategory(
  transactionId: string,
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // First ensure we have default categories and get the mapping
    const defaultCategories = await ensureDefaultCategories(userId);

    // Try to find the category directly in the database first
    let dbCategory = await prisma.category.findFirst({
      where: {
        userId,
        id: categoryId,
      },
    });

    // If not found directly, try to find it from default categories mapping
    if (!dbCategory) {
      const matchingCategory = defaultCategories.find(
        (cat) => cat.ruleId === categoryId
      );

      if (!matchingCategory) {
        throw new Error("Category not found");
      }

      dbCategory = await prisma.category.findUnique({
        where: {
          id: matchingCategory.id,
        },
      });

      if (!dbCategory) {
        throw new Error("Category not found in database");
      }
    }

    // Update the transaction with the actual database category ID
    await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        categoryId: dbCategory.id,
        categoryValidated: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction category:", error);
    return {
      success: false,
      error: "Failed to update transaction category",
    };
  }
}
