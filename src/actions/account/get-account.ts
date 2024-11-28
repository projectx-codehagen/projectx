"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
});

export async function getAccount(input: z.infer<typeof getAccountSchema>) {
  try {
    console.log("Starting account fetch process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getAccountSchema.parse(input);

    const account = await prisma.bankAccount.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
      include: {
        Balance: {
          orderBy: { date: "desc" },
          take: 1,
        },
        Transaction: {
          orderBy: { date: "desc" },
          take: 10,
          include: {
            category: true,
            currency: true,
          },
        },
      },
    });

    if (!account) {
      throw new Error("Account not found or unauthorized");
    }

    return { success: true, account };
  } catch (error) {
    console.error("Error in getAccount:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the account",
    };
  }
}
