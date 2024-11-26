"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { InvestmentType, Prisma } from "@prisma/client";
import { z } from "zod";

const createInvestmentSchema = z.object({
  name: z.string().min(2, {
    message: "Investment name must be at least 2 characters.",
  }),
  type: z.enum(["STOCKS", "CRYPTO", "ETF", "OTHER"], {
    required_error: "Please select an investment type",
  }),
  amount: z.string().min(1, "Amount is required"),
  shares: z.string().optional(),
  purchasePrice: z.string().optional(),
  currentPrice: z.string().optional(),
  description: z.string().optional(),
});

export async function createInvestment(
  input: z.infer<typeof createInvestmentSchema>
) {
  try {
    console.log("Starting investment creation with input:", input);

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createInvestmentSchema.parse(input);
    const amount = new Prisma.Decimal(validatedFields.amount);
    const purchasePrice = validatedFields.purchasePrice
      ? new Prisma.Decimal(validatedFields.purchasePrice)
      : null;
    const shares = validatedFields.shares
      ? new Prisma.Decimal(validatedFields.shares)
      : null;

    // Create the investment
    const investment = await prisma.investment.create({
      data: {
        name: validatedFields.name,
        type: validatedFields.type as InvestmentType,
        amount,
        shares,
        purchasePrice,
        currentPrice: purchasePrice,
        description: validatedFields.description,
        userId,
      },
    });

    console.log("Created investment:", investment);

    // Create initial valuation
    const valuation = await prisma.investmentValuation.create({
      data: {
        value: amount,
        date: new Date(),
        investmentId: investment.id,
      },
    });

    console.log("Created valuation:", valuation);

    // Create initial transaction
    const transaction = await prisma.investmentTransaction.create({
      data: {
        type: "BUY",
        amount,
        shares,
        price: purchasePrice || amount,
        date: new Date(),
        description: `Initial purchase of ${validatedFields.name}`,
        investmentId: investment.id,
      },
    });

    console.log("Created transaction:", transaction);

    revalidatePath("/investments");
    return { success: true, investment };
  } catch (error) {
    console.error("Error in createInvestment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the investment",
    };
  }
}
