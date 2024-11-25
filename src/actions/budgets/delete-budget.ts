"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteBudgetSchema = z.object({
  id: z.string().min(1, "Budget ID is required"),
});

export async function deleteBudget(input: z.infer<typeof deleteBudgetSchema>) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteBudgetSchema.parse(input);

    // Verify budget ownership
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
    });

    if (!existingBudget) {
      throw new Error("Budget not found or unauthorized");
    }

    await prisma.budget.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteBudget:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the budget",
    };
  }
}
