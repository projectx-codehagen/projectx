"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma, GoalType } from "@prisma/client";
import { z } from "zod";

const createSavingsGoalSchema = z.object({
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  type: z.enum(["EMERGENCY_FUND", "RETIREMENT", "DOWN_PAYMENT", "CUSTOM"], {
    required_error: "Please select a goal type",
  }),
  target: z.string().min(1, "Target amount is required"),
  deadline: z.date().optional(),
  description: z.string().optional(),
});

export async function createSavingsGoal(
  input: z.infer<typeof createSavingsGoalSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createSavingsGoalSchema.parse(input);

    // Get existing goals count for priority
    const existingGoals = await prisma.savingsGoal.count({
      where: { userId },
    });

    // Create the goal
    const goal = await prisma.savingsGoal.create({
      data: {
        name: validatedFields.name,
        type: validatedFields.type as GoalType,
        target: new Prisma.Decimal(validatedFields.target),
        current: new Prisma.Decimal(0),
        deadline: validatedFields.deadline,
        description: validatedFields.description,
        priority: existingGoals + 1,
        userId,
      },
    });

    // Create initial progress entry
    await prisma.savingsProgress.create({
      data: {
        amount: new Prisma.Decimal(0),
        date: new Date(),
        goalId: goal.id,
      },
    });

    revalidatePath("/savings");
    return { success: true, goal };
  } catch (error) {
    console.error("Error in createSavingsGoal:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the savings goal",
    };
  }
}
