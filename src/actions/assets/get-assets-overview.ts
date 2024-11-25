"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

interface AssetOverview {
  totalAssets: number;
  liquidAssets: number;
  fixedAssets: number;
  assetAllocation: {
    name: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    asset: {
      name: string;
      type: string;
    };
  }[];
  monthlyTrend: {
    date: string;
    total: number;
    liquid: number;
    fixed: number;
  }[];
}

export async function getAssetsOverview(): Promise<{
  success: boolean;
  data?: AssetOverview;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    // Get all assets with their latest valuations
    const assets = await prisma.asset.findMany({
      where: { userId },
      include: {
        valuations: {
          orderBy: { date: "desc" },
          take: 1,
        },
        transactions: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
    });

    // Calculate totals
    const totalAssets = assets.reduce(
      (sum, asset) => sum + asset.value.toNumber(),
      0
    );

    // Calculate liquid vs fixed assets
    const liquidAssets = assets
      .filter((asset) => ["PRECIOUS_METALS", "OTHER"].includes(asset.type))
      .reduce((sum, asset) => sum + asset.value.toNumber(), 0);

    const fixedAssets = assets
      .filter((asset) => ["REAL_ESTATE", "VEHICLE"].includes(asset.type))
      .reduce((sum, asset) => sum + asset.value.toNumber(), 0);

    // Calculate asset allocation
    const assetAllocation = Object.entries(
      assets.reduce((acc, asset) => {
        const type = asset.type;
        acc[type] = (acc[type] || 0) + asset.value.toNumber();
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalAssets) * 100,
      progress: `w-[${((value / totalAssets) * 100).toFixed(1)}%]`,
    }));

    // Get recent transactions
    const recentTransactions = assets
      .flatMap((asset) =>
        asset.transactions.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount.toNumber(),
          date: tx.date,
          description: tx.description || "",
          asset: {
            name: asset.name,
            type: asset.type,
          },
        }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    // Calculate monthly trend
    const transactions = assets
      .flatMap((asset) => asset.transactions)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (transactions.length === 0) {
      return {
        success: true,
        data: {
          totalAssets,
          liquidAssets,
          fixedAssets,
          assetAllocation,
          recentTransactions,
          monthlyTrend: [],
        },
      };
    }

    // Get first and last transaction dates
    const firstDate = new Date(transactions[0].date);
    const lastDate = new Date(); // Use current date as end point

    // Calculate trends for total, liquid, and fixed assets
    const trend: {
      date: string;
      total: number;
      liquid: number;
      fixed: number;
    }[] = [];
    let currentDate = new Date(firstDate);

    while (currentDate <= lastDate) {
      // Find transactions that happened on or before this date
      const relevantTransactions = transactions.filter(
        (tx) => new Date(tx.date) <= currentDate
      );

      // Calculate totals by asset type
      const totals = relevantTransactions.reduce(
        (acc, tx) => {
          const asset = assets.find((a) =>
            a.transactions.some((t) => t.id === tx.id)
          );
          if (!asset) return acc;

          if (["PRECIOUS_METALS", "OTHER"].includes(asset.type)) {
            acc.liquid += tx.amount.toNumber();
          } else if (["REAL_ESTATE", "VEHICLE"].includes(asset.type)) {
            acc.fixed += tx.amount.toNumber();
          }
          acc.total += tx.amount.toNumber();
          return acc;
        },
        { total: 0, liquid: 0, fixed: 0 }
      );

      // Add data point
      trend.push({
        date: currentDate.toISOString().split("T")[0],
        total: totals.total,
        liquid: totals.liquid,
        fixed: totals.fixed,
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      success: true,
      data: {
        totalAssets,
        liquidAssets,
        fixedAssets,
        assetAllocation,
        recentTransactions,
        monthlyTrend: trend,
      },
    };
  } catch (error) {
    console.error("Error in getAssetsOverview:", error);
    return {
      success: false,
      error: "Failed to fetch assets overview",
    };
  }
}
