"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getAccounts() {
  try {
    console.log("Starting accounts fetch process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const accounts = await prisma.bankAccount.findMany({
      where: { userId },
      include: {
        Balance: {
          orderBy: { date: "desc" },
          take: 1,
        },
        Transaction: {
          orderBy: { date: "desc" },
          take: 1,
        },
        resource: {
          select: {
            integration: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return { success: true, accounts };
  } catch (error) {
    console.error("Error in getAccounts:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching accounts",
    };
  }
}
