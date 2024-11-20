"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AccountType } from "@prisma/client";
import { processCSVTransactions } from "./process-csv-transactions";
import { seedCurrencies } from "../currency/seed-currencies";

interface CreateAccountInput {
  name: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  balance?: string;
  csvData?: {
    date: number;
    description: number;
    amount: number;
  };
  csvContent?: string;
}

export async function createNewAccount(input: CreateAccountInput) {
  try {
    console.log("Starting account creation process");

    // Ensure currencies exist in the database
    await seedCurrencies();

    // Verify the currency exists
    const currency = await prisma.currency.findUnique({
      where: { iso: input.currency },
    });

    if (!currency) {
      throw new Error(`Currency ${input.currency} is not supported`);
    }

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

    const workspaceId = user.workspace.id;

    // Create the account
    const account = await prisma.bankAccount.create({
      data: {
        name: input.name,
        initialAmount: 0,
        accountType: AccountType.BANK,
        workspaceId,
        userId,
        originalId: input.accountNumber,
        orgId: null,
        originalPayload: {
          bankName: input.bankName,
          currency: input.currency,
        },
      },
    });

    // Process CSV content if provided
    if (input.csvData && input.csvContent) {
      console.log("Processing CSV content...");
      const result = await processCSVTransactions({
        accountId: account.id,
        currencyIso: input.currency,
        csvContent: input.csvContent,
        mapping: input.csvData,
      });

      if (!result.success) {
        throw new Error(`Failed to process CSV: ${result.error}`);
      }
    }

    revalidatePath("/dashboard");
    return { success: true, account };
  } catch (error) {
    console.error("Error in createNewAccount:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the account",
    };
  }
}
