"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

const defaultGoals = [
  {
    name: "Emergency Fund",
    target: 15000,
    type: "EMERGENCY_FUND",
    description: "3-6 months of living expenses for emergencies",
    priority: 1,
  },
  {
    name: "Retirement",
    target: 500000,
    type: "RETIREMENT",
    description: "Long-term retirement savings goal",
    priority: 2,
  },
  {
    name: "House Down Payment",
    target: 50000,
    type: "DOWN_PAYMENT",
    description: "Saving for a house down payment",
    priority: 3,
  },
] as const;

export async function createDefaultGoals(userId: string) {
  try {
    const goals = await Promise.all(
      defaultGoals.map((goal) =>
        prisma.savingsGoal.create({
          data: {
            name: goal.name,
            target: new Prisma.Decimal(goal.target),
            current: new Prisma.Decimal(0),
            type: goal.type,
            description: goal.description,
            priority: goal.priority,
            isDefault: true,
            userId,
          },
        })
      )
    );

    return { success: true, goals };
  } catch (error) {
    console.error("Error creating default goals:", error);
    return { success: false, error: "Failed to create default goals" };
  }
}
