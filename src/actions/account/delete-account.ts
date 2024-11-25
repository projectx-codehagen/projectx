"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
});

export async function deleteAccount(
  input: z.infer<typeof deleteAccountSchema>
) {
  try {
    console.log("Starting account deletion process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteAccountSchema.parse(input);

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

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAccount:", error);
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
