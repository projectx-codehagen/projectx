"use server";

import { prisma } from "@/lib/db";

export async function incrementUserStats(data: {
  isNewUser?: boolean;
  platform?: string;
  browser?: string;
  country?: string;
}) {
  try {
    console.log("Starting user stats increment process");

    // Get or create stats record
    let stats = await prisma.stats.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!stats) {
      stats = await prisma.stats.create({
        data: {
          totalUsers: 0,
          activeUsers: 0,
          dailyActiveUsers: 0,
          weeklyActiveUsers: 0,
          monthlyActiveUsers: 0,
        },
      });
    }

    // Update stats
    const updates: any = {
      activeUsers: { increment: 1 },
      dailyActiveUsers: { increment: 1 },
      weeklyActiveUsers: { increment: 1 },
      monthlyActiveUsers: { increment: 1 },
    };

    // Increment total users only for new users
    if (data.isNewUser) {
      updates.totalUsers = { increment: 1 };
    }

    // Update platform stats if provided
    if (data.platform) {
      const currentOS = (stats.operatingSystem || {}) as Record<string, number>;
      updates.operatingSystem = {
        ...currentOS,
        [data.platform]: (currentOS[data.platform] || 0) + 1,
      };
    }

    // Update browser stats if provided
    if (data.browser) {
      const currentBrowsers = (stats.browser || {}) as Record<string, number>;
      updates.browser = {
        ...currentBrowsers,
        [data.browser]: (currentBrowsers[data.browser] || 0) + 1,
      };
    }

    // Update country stats if provided
    if (data.country) {
      const currentCountries = (stats.country || {}) as Record<string, number>;
      updates.country = {
        ...currentCountries,
        [data.country]: (currentCountries[data.country] || 0) + 1,
      };
    }

    // Update stats
    const updatedStats = await prisma.stats.update({
      where: { id: stats.id },
      data: updates,
    });

    // Create history record
    await prisma.statsHistory.create({
      data: {
        totalUsers: updatedStats.totalUsers,
        activeUsers: updatedStats.activeUsers,
        totalAccounts: updatedStats.totalAccounts,
        totalTransactions: updatedStats.totalTransactions,
        totalAssets: updatedStats.totalAssets,
        totalLiabilities: updatedStats.totalLiabilities,
        totalInvestments: updatedStats.totalInvestments,
        dailyActiveUsers: updatedStats.dailyActiveUsers,
        weeklyActiveUsers: updatedStats.weeklyActiveUsers,
        monthlyActiveUsers: updatedStats.monthlyActiveUsers,
        snapshot: {
          operatingSystem: updatedStats.operatingSystem,
          browser: updatedStats.browser,
          country: updatedStats.country,
          timestamp: new Date(),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in incrementUserStats:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating user stats",
    };
  }
} 