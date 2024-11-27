"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

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

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Update transaction
    await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        categoryId,
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
