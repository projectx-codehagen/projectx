"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

interface LiabilityOverview {
  totalLiabilities: number;
  monthlyPayments: number;
  debtToIncome: number;
  liabilityAllocation: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
  recentPayments: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    liability: {
      id: string;
      name: string;
      type: string;
      amount: number;
      interestRate: number;
      monthlyPayment: number;
    };
  }[];
  monthlyTrend: {
    date: string;
    total: number;
    mortgage: number;
    other: number;
  }[];
}

const liabilityTypeDisplayNames: Record<string, string> = {
  MORTGAGE: "Mortgage",
  CREDIT_CARD: "Credit Card",
  CAR_LOAN: "Car Loan",
  STUDENT_LOAN: "Student Loan",
};

export async function getLiabilitiesOverview(): Promise<{
  success: boolean;
  data?: LiabilityOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get all liabilities with their payments
    const liabilities = await prisma.liability.findMany({
      where: { userId },
      include: {
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    // Calculate totals
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.amount.toNumber(),
      0
    );

    const monthlyPayments = liabilities.reduce(
      (sum, liability) => sum + liability.monthlyPayment.toNumber(),
      0
    );

    // Calculate debt-to-income ratio (placeholder - you'll need to get income from somewhere)
    const monthlyIncome = 10000; // Replace with actual income calculation
    const debtToIncome = (monthlyPayments / monthlyIncome) * 100;

    // Calculate liability allocation
    const liabilityAllocation = Object.entries(
      liabilities.reduce((acc, liability) => {
        const type = liability.type;
        acc[type] = (acc[type] || 0) + liability.amount.toNumber();
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({
      name: liabilityTypeDisplayNames[name] || name,
      originalName: name,
      value,
      percentage: (value / totalLiabilities) * 100,
      progress: `w-[${((value / totalLiabilities) * 100).toFixed(1)}%]`,
    }));

    // Get recent payments
    const recentPayments = liabilities
      .flatMap((liability) =>
        liability.payments.map((payment) => ({
          id: payment.id,
          type: payment.type,
          amount: payment.amount.toNumber(),
          date: payment.date,
          description: payment.description || "",
          liability: {
            id: liability.id,
            name: liability.name,
            type: liability.type,
            amount: liability.amount.toNumber(),
            interestRate: liability.interestRate.toNumber(),
            monthlyPayment: liability.monthlyPayment.toNumber(),
          },
        }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate monthly trend
    const payments = liabilities
      .flatMap((liability) => liability.payments)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (payments.length === 0) {
      return {
        success: true,
        data: {
          totalLiabilities,
          monthlyPayments,
          debtToIncome,
          liabilityAllocation,
          recentPayments,
          monthlyTrend: [],
        },
      };
    }

    // Calculate trend data
    const firstDate = new Date(payments[0].date);
    const lastDate = new Date();

    const trend: {
      date: string;
      total: number;
      mortgage: number;
      other: number;
    }[] = [];
    let currentDate = new Date(firstDate);

    while (currentDate <= lastDate) {
      const relevantLiabilities = liabilities.filter(
        (liability) =>
          liability.startDate &&
          new Date(liability.startDate) <= currentDate &&
          (!liability.endDate || new Date(liability.endDate) >= currentDate)
      );

      const totals = relevantLiabilities.reduce(
        (acc, liability) => {
          const amount = liability.amount.toNumber();
          if (liability.type === "MORTGAGE") {
            acc.mortgage += amount;
          } else {
            acc.other += amount;
          }
          acc.total += amount;
          return acc;
        },
        { total: 0, mortgage: 0, other: 0 }
      );

      trend.push({
        date: currentDate.toISOString().split("T")[0],
        ...totals,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: {
        totalLiabilities,
        monthlyPayments,
        debtToIncome,
        liabilityAllocation,
        recentPayments,
        monthlyTrend: trend,
      },
    };
  } catch (error) {
    console.error("Error in getLiabilitiesOverview:", error);
    return {
      success: false,
      error: "Failed to fetch liabilities overview",
    };
  }
}
