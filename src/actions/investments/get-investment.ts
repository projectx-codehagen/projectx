"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getInvestmentSchema = z.object({
  id: z.string().min(1, "Investment ID is required"),
});

export async function getInvestment(
  input: z.infer<typeof getInvestmentSchema>
) {
  try {
    console.log("Starting investment fetch process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getInvestmentSchema.parse(input);

    const investment = await prisma.investment.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
      include: {
        valuations: {
          orderBy: { date: "desc" },
          take: 1,
        },
        transactions: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!investment) {
      throw new Error("Investment not found or unauthorized");
    }

    return { success: true, investment };
  } catch (error) {
    console.error("Error in getInvestment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the investment",
    };
  }
}
