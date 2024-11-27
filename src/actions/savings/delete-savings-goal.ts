"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function deleteSavingsGoal(goalId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    if (!goalId) {
      throw new Error("Goal ID is required");
    }

    // Verify goal ownership
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      include: {
        progress: true,
      },
    });

    if (!goal) {
      throw new Error("Goal not found or unauthorized");
    }

    // Delete the goal (cascade will handle progress entries)
    await prisma.savingsGoal.delete({
      where: { id: goalId },
    });

    revalidatePath("/savings");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSavingsGoal:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the savings goal",
    };
  }
}
