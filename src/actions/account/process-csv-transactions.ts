"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface CSVMapping {
  date: number;
  description: number;
  amount: number;
}

interface ProcessCSVInput {
  accountId: string;
  currencyIso: string;
  csvContent: string;
  mapping: CSVMapping;
}

export async function processCSVTransactions(input: ProcessCSVInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const rows = input.csvContent
      .split("\n")
      .slice(1) // Skip header row
      .filter((row) => row.trim() !== ""); // Remove empty rows

    const transactions = rows.map((row) => {
      const columns = row.split(",").map((col) => col.trim());

      // Parse date - assuming format YYYY-MM-DD, adjust as needed
      const dateStr = columns[input.mapping.date];
      const date = new Date(dateStr);

      // Parse amount - convert to decimal
      const amountStr = columns[input.mapping.amount].replace(/[^0-9.-]/g, "");
      const amount = parseFloat(amountStr);

      // Get description
      const description = columns[input.mapping.description];

      return {
        accountId: input.accountId,
        currencyIso: input.currencyIso,
        amount,
        date,
        description,
        review: false,
      };
    });

    // Create transactions in batches of 100
    const batchSize = 100;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      await prisma.transaction.createMany({
        data: batch,
      });
    }

    // Update account balance
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    await prisma.bankAccount.update({
      where: { id: input.accountId },
      data: {
        initialAmount: totalAmount,
      },
    });

    return {
      success: true,
      transactionCount: transactions.length,
      totalAmount,
    };
  } catch (error) {
    console.error("Error processing CSV:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
