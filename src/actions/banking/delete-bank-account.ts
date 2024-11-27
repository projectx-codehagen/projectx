"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteBankAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
});

export async function deleteBankAccount(
  input: z.infer<typeof deleteBankAccountSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteBankAccountSchema.parse(input);

    // Verify account ownership
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
    });

    if (!existingAccount) {
      throw new Error("Account not found or unauthorized");
    }

    // Delete the account (cascade will handle related records)
    await prisma.bankAccount.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/banking");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteBankAccount:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the account",
    };
  }
}
