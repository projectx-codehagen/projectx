"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AssetType, Prisma } from "@prisma/client";
import { z } from "zod";

const updateAssetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(2, "Asset name must be at least 2 characters."),
  type: z.enum(["REAL_ESTATE", "VEHICLE", "PRECIOUS_METALS", "OTHER"]),
  value: z.string().min(1, "Value is required"),
  purchaseDate: z.date().optional(),
  description: z.string().optional(),
});

export async function updateAsset(input: z.infer<typeof updateAssetSchema>) {
  try {
    console.log("Starting asset update process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateAssetSchema.parse(input);

    // Verify asset ownership
    const existingAsset = await prisma.asset.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
    });

    if (!existingAsset) {
      throw new Error("Asset not found or unauthorized");
    }

    const newValue = new Prisma.Decimal(validatedFields.value);

    // Update the asset
    const asset = await prisma.asset.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        type: validatedFields.type as AssetType,
        value: newValue,
        purchaseDate: validatedFields.purchaseDate,
        description: validatedFields.description,
        originalPayload: {
          type: validatedFields.type,
          updatedValue: validatedFields.value,
          updatedAt: new Date(),
        },
      },
    });

    // Create new valuation if value changed
    if (!existingAsset.value.equals(newValue)) {
      await prisma.assetValuation.create({
        data: {
          value: newValue,
          date: new Date(),
          assetId: asset.id,
        },
      });
    }

    revalidatePath("/assets");
    return { success: true, asset };
  } catch (error) {
    console.error("Error in updateAsset:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the asset",
    };
  }
}
