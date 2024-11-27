"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";
import { z } from "zod";
import { updateBankAccountSchema } from "@/schemas/bank-account-schema";

interface UpdateBankAccountInput {
  id: string;
  name: string;
  accountType: AccountType;
  description?: string;
}

export async function updateBankAccount(input: UpdateBankAccountInput) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { id: input.id },
    });

    const currentPayload =
      (existingAccount?.originalPayload as Record<string, unknown>) || {};

    const account = await prisma.bankAccount.update({
      where: {
        id: input.id,
        userId,
      },
      data: {
        name: input.name,
        accountType: input.accountType,
        originalPayload: {
          ...currentPayload,
          description: input.description,
          updatedAt: new Date(),
        },
      },
    });

    revalidatePath("/banking");
    return { success: true, account };
  } catch (error) {
    console.error("Error in updateBankAccount:", error);
    return { success: false, error: "Failed to update account" };
  }
}
