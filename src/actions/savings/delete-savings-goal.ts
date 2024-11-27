"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSavingsGoal(goalId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized: No user found" };
    }

    if (!goalId) {
      return { success: false, error: "Goal ID is required" };
    }

    // Verify goal ownership
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      return { success: false, error: "Goal not found or unauthorized" };
    }

    // Delete the goal (this will cascade delete progress entries)
    await prisma.savingsGoal.delete({
      where: { id: goalId },
    });

    revalidatePath("/savings");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSavingsGoal:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the savings goal",
    };
  }
}
