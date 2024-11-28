"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function validateTransactionCategory(
  transactionId: string,
  approved: boolean
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        categoryValidated: true,
        // If not approved, clear the suggested category
        categoryId: approved ? undefined : null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error validating category:", error);
    return { success: false, error: "Failed to validate category" };
  }
}
