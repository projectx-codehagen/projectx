"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";
import { z } from "zod";

const updateAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
  name: z.string().min(2, "Account name must be at least 2 characters"),
  accountNumber: z.string(),
  bankName: z.string(),
  currency: z.string().min(3, "Currency code must be 3 characters"),
  accountType: z.enum(["BANK", "CRYPTO", "INVESTMENT"]).default("BANK"),
});

export async function updateAccount(
  input: z.infer<typeof updateAccountSchema>
) {
  try {
    console.log("Starting account update process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get user's active workspace
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspace: true,
      },
    });

    if (!user?.workspace) {
      throw new Error("No workspace found");
    }

    const validatedFields = updateAccountSchema.parse(input);

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

    // Update the account
    const account = await prisma.bankAccount.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        accountType: validatedFields.accountType as AccountType,
        originalId: validatedFields.accountNumber,
        originalPayload: {
          bankName: validatedFields.bankName,
          currency: validatedFields.currency,
          updatedAt: new Date(),
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, account };
  } catch (error) {
    console.error("Error in updateAccount:", error);
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
