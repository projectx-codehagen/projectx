"use server";

import { prisma } from "@/lib/db";

const DEFAULT_CURRENCIES = [
  { iso: "USD", symbol: "$", numericCode: 840 },
  { iso: "EUR", symbol: "€", numericCode: 978 },
  { iso: "GBP", symbol: "£", numericCode: 826 },
  { iso: "NOK", symbol: "kr", numericCode: 578 },
] as const;

export async function seedCurrencies() {
  try {
    // Create all currencies in a single transaction
    await prisma.$transaction(
      DEFAULT_CURRENCIES.map((currency) =>
        prisma.currency.upsert({
          where: { iso: currency.iso },
          update: {}, // No updates if exists
          create: currency,
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error seeding currencies:", error);
    return { success: false, error: (error as Error).message };
  }
}
