"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getAssetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
});

export async function getAsset(input: z.infer<typeof getAssetSchema>) {
  try {
    console.log("Starting asset fetch process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getAssetSchema.parse(input);

    const asset = await prisma.asset.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
      include: {
        valuations: {
          orderBy: { date: "desc" },
          take: 1,
        },
        transactions: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!asset) {
      throw new Error("Asset not found or unauthorized");
    }

    return { success: true, asset };
  } catch (error) {
    console.error("Error in getAsset:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the asset",
    };
  }
}
