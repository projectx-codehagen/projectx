"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const updateSavingsGoalSchema = z.object({
  id: z.string().min(1, "Goal ID is required"),
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  target: z.string().min(1, "Target amount is required"),
  deadline: z.date().optional(),
  description: z.string().optional(),
});

export async function updateSavingsGoal(
  input: z.infer<typeof updateSavingsGoalSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    console.log("Updating goal with input:", input);

    const validatedFields = updateSavingsGoalSchema.parse(input);

    // Verify goal ownership
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
    });

    if (!goal) {
      throw new Error("Goal not found or unauthorized");
    }

    // Update the goal
    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        target: new Prisma.Decimal(validatedFields.target),
        deadline: validatedFields.deadline,
        description: validatedFields.description,
      },
    });

    revalidatePath("/savings");
    return { success: true, goal: updatedGoal };
  } catch (error) {
    console.error("Error in updateSavingsGoal:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the savings goal",
    };
  }
}
