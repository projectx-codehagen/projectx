"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";
import { z } from "zod";
import { updateBankAccountSchema } from "@/schemas/bank-account-schema";

export async function updateBankAccount(
  input: z.infer<typeof updateBankAccountSchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateBankAccountSchema.parse(input);

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

    // Get existing payload or create new one
    const currentPayload =
      (existingAccount.originalPayload as Record<string, unknown>) || {};

    // Update the account
    const account = await prisma.bankAccount.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        accountType: validatedFields.accountType as AccountType,
        originalPayload: {
          ...currentPayload,
          description: validatedFields.description,
          updatedAt: new Date(),
        },
      },
    });

    revalidatePath("/banking");
    return { success: true, account };
  } catch (error) {
    console.error("Error in updateBankAccount:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the account",
    };
  }
}
