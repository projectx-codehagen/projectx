"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { InvestmentType, Prisma } from "@prisma/client";
import { z } from "zod";

const updateInvestmentSchema = z.object({
  id: z.string().min(1, "Investment ID is required"),
  name: z.string().min(2, "Investment name must be at least 2 characters."),
  type: z.enum(["STOCKS", "CRYPTO", "ETF", "OTHER"]),
  amount: z.string().min(1, "Amount is required"),
  shares: z.string().optional(),
  currentPrice: z.string().optional(),
  description: z.string().optional(),
});

export async function updateInvestment(
  input: z.infer<typeof updateInvestmentSchema>
) {
  try {
    console.log("Starting investment update process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateInvestmentSchema.parse(input);

    // Verify investment ownership
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
    });

    if (!existingInvestment) {
      throw new Error("Investment not found or unauthorized");
    }

    const newAmount = new Prisma.Decimal(validatedFields.amount);
    const newShares = validatedFields.shares
      ? new Prisma.Decimal(validatedFields.shares)
      : null;
    const newPrice = validatedFields.currentPrice
      ? new Prisma.Decimal(validatedFields.currentPrice)
      : null;

    // Update the investment
    const investment = await prisma.investment.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        type: validatedFields.type as InvestmentType,
        amount: newAmount,
        shares: newShares,
        currentPrice: newPrice,
        description: validatedFields.description,
      },
    });

    // Create new valuation if amount changed
    if (!existingInvestment.amount.equals(newAmount)) {
      await prisma.investmentValuation.create({
        data: {
          value: newAmount,
          date: new Date(),
          investmentId: investment.id,
        },
      });
    }

    revalidatePath("/investments");
    return { success: true, investment };
  } catch (error) {
    console.error("Error in updateInvestment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the investment",
    };
  }
}
