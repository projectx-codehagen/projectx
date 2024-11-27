"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface AccountDetails {
  account: {
    id: string;
    name: string;
    type: string;
    balance: number;
    accountNumber?: string;
    lastUpdated: Date;
  };
  transactions: {
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: string;
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  }[];
}

export async function getAccountDetails(
  accountId: string
): Promise<{ success: boolean; data?: AccountDetails; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get account with latest balance
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId,
      },
      include: {
        Balance: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      success: true,
      data: {
        account: {
          id: account.id,
          name: account.name,
          type: account.accountType,
          balance: account.Balance[0]?.amount || 0,
          accountNumber: account.originalId || undefined,
          lastUpdated: account.Balance[0]?.date || account.updatedAt,
        },
        transactions: transactions.map((tx) => ({
          id: tx.id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          category: tx.category
            ? {
                id: tx.category.id,
                name: tx.category.name,
                icon: tx.category.icon,
              }
            : undefined,
        })),
      },
    };
  } catch (error) {
    console.error("Error in getAccountDetails:", error);
    return {
      success: false,
      error: "Failed to fetch account details",
    };
  }
}
