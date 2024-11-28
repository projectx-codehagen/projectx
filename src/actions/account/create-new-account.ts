"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma, AccountType } from "@prisma/client";

interface CreateAccountInput {
  name: string;
  bankName: string;
  accountType: AccountType;
  currency: string;
  balance?: string;
  csvData: {
    date: number;
    description: number;
    amount: number;
  };
  csvContent: string;
}

export async function createNewAccount(input: CreateAccountInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Create or connect to currency
    const currency = await prisma.currency.upsert({
      where: { iso: input.currency },
      update: {},
      create: {
        iso: input.currency,
        symbol: getCurrencySymbol(input.currency),
        name: getCurrencyName(input.currency),
      },
    });

    // Create the account with the specified account type
    const account = await prisma.bankAccount.create({
      data: {
        name: input.name,
        accountType: input.accountType,
        originalPayload: {
          bankName: input.bankName,
          currency: input.currency,
        },
        userId,
      },
    });

    // Create initial balance record
    const initialBalance = new Prisma.Decimal(input.balance || "0");
    await prisma.balance.create({
      data: {
        amount: initialBalance.toNumber(),
        date: new Date(),
        bankAccount: {
          connect: {
            id: account.id,
          },
        },
        currency: {
          connect: {
            iso: input.currency,
          },
        },
      },
    });

    // Process CSV transactions
    const lines = input.csvContent.split("\n");
    const headers = lines[0].split(",");
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(",");
      if (line.length === headers.length) {
        const amount = new Prisma.Decimal(
          line[input.csvData.amount].replace(/[^-0-9.]/g, "")
        );
        transactions.push({
          date: new Date(line[input.csvData.date]),
          description: line[input.csvData.description].trim(),
          amount: amount.toNumber(),
          accountId: account.id,
          currencyIso: input.currency,
          type: amount.isNegative() ? "DEBIT" : "CREDIT",
        });
      }
    }

    // Create transactions in batches
    await prisma.transaction.createMany({
      data: transactions,
    });

    // Update account balance based on transactions
    const totalTransactions = transactions.reduce(
      (sum, tx) => sum.plus(tx.amount),
      initialBalance
    );

    await prisma.balance.create({
      data: {
        amount: totalTransactions.toNumber(),
        date: new Date(),
        bankAccount: {
          connect: {
            id: account.id,
          },
        },
        currency: {
          connect: {
            iso: input.currency,
          },
        },
      },
    });

    revalidatePath("/banking");
    return { success: true, account };
  } catch (error) {
    console.error("Error in createNewAccount:", error);
    return { success: false, error: "Failed to create account" };
  }
}

// Helper functions for currency information
function getCurrencyName(iso: string): string {
  const currencyNames: Record<string, string> = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    NOK: "Norwegian Krone",
  };
  return currencyNames[iso] || iso;
}

function getCurrencySymbol(iso: string): string {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NOK: "kr",
  };
  return currencySymbols[iso] || iso;
}
