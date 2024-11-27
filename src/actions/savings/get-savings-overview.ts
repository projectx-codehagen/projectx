"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface SavingsOverview {
  totalSavings: number;
  monthlyChange: number;
  monthlyChangePercentage: number;
  savingsGoals: {
    id: string;
    name: string;
    type: string;
    current: number;
    target: number;
    progress: number;
    deadline?: Date;
    description?: string;
  }[];
  monthlySavings: {
    date: string;
    amount: number;
  }[];
  recommendations: {
    type: "INCREASE" | "GOAL" | "DIVERSIFY";
    title: string;
    description: string;
    action: string;
    priority: "high" | "medium" | "low";
  }[];
}

export async function getSavingsOverview(): Promise<{
  success: boolean;
  data?: SavingsOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get all savings goals with their progress
    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId },
      include: {
        progress: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { priority: "asc" },
    });

    // Calculate total savings and monthly change
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const [currentProgress, lastMonthProgress] = await Promise.all([
      prisma.savingsProgress.findMany({
        where: {
          goal: { userId },
          date: { gte: lastMonth },
        },
        orderBy: { date: "desc" },
        include: { goal: true },
      }),
      prisma.savingsProgress.findMany({
        where: {
          goal: { userId },
          date: { lt: lastMonth },
        },
        orderBy: { date: "desc" },
        take: savingsGoals.length,
        include: { goal: true },
      }),
    ]);

    const totalSavings = savingsGoals.reduce(
      (sum, goal) => sum + goal.current.toNumber(),
      0
    );

    const lastMonthTotal = lastMonthProgress.reduce(
      (sum, progress) => sum + progress.amount.toNumber(),
      0
    );

    const monthlyChange = totalSavings - lastMonthTotal;
    const monthlyChangePercentage =
      lastMonthTotal > 0 ? (monthlyChange / lastMonthTotal) * 100 : 0;

    // Format goals data
    const formattedGoals = savingsGoals.map((goal) => ({
      id: goal.id,
      name: goal.name,
      type: goal.type,
      current: goal.current.toNumber(),
      target: goal.target.toNumber(),
      progress: (goal.current.toNumber() / goal.target.toNumber()) * 100,
      deadline: goal.deadline,
      description: goal.description,
    }));

    // Generate recommendations
    const recommendations: SavingsOverview["recommendations"] = [];

    if (monthlyChange <= 0) {
      recommendations.push({
        type: "INCREASE" as const,
        title: "Increase Your Savings",
        description:
          "Your savings decreased this month. Consider reviewing your budget.",
        action: "Review Budget",
        priority: "high" as const,
      });
    }

    const emergencyFund = savingsGoals.find(
      (goal) => goal.type === "EMERGENCY_FUND"
    );
    if (
      emergencyFund &&
      emergencyFund.current.toNumber() < emergencyFund.target.toNumber() * 0.5
    ) {
      recommendations.push({
        type: "GOAL" as const,
        title: "Build Emergency Fund",
        description: "Your emergency fund is below recommended levels.",
        action: "Set Goal",
        priority: "high" as const,
      });
    }

    return {
      success: true,
      data: {
        totalSavings,
        monthlyChange,
        monthlyChangePercentage,
        savingsGoals: formattedGoals,
        monthlySavings: [], // TODO: Calculate from historical data
        recommendations,
      },
    };
  } catch (error) {
    console.error("Error in getSavingsOverview:", error);
    return {
      success: false,
      error: "Failed to fetch savings overview",
    };
  }
}
