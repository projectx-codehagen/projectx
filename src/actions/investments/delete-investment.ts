"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteInvestmentSchema = z.object({
  id: z.string().min(1, "Investment ID is required"),
});

export async function deleteInvestment(
  input: z.infer<typeof deleteInvestmentSchema>
) {
  try {
    console.log("Starting investment deletion process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteInvestmentSchema.parse(input);

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

    // Delete the investment (cascade will handle related records)
    await prisma.investment.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/investments");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteInvestment:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the investment",
    };
  }
}
