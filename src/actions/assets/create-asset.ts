"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { AssetType } from "@prisma/client";
import { z } from "zod";

const createAssetSchema = z.object({
  name: z.string().min(2, {
    message: "Asset name must be at least 2 characters.",
  }),
  type: z.enum(["REAL_ESTATE", "VEHICLE", "PRECIOUS_METALS", "OTHER"], {
    required_error: "Please select an asset type",
  }),
  value: z.string().min(1, "Value is required"),
  purchaseDate: z.date().optional(),
  description: z.string().optional(),
});

export async function createAsset(input: z.infer<typeof createAssetSchema>) {
  try {
    console.log("Starting asset creation with input:", input);

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createAssetSchema.parse(input);
    console.log("Validated fields:", validatedFields);

    // Create the asset
    const asset = await prisma.asset.create({
      data: {
        name: validatedFields.name,
        type: validatedFields.type as AssetType,
        value: parseFloat(validatedFields.value),
        purchaseDate: validatedFields.purchaseDate,
        description: validatedFields.description,
        userId: userId,
        originalPayload: {
          type: validatedFields.type,
          initialValue: validatedFields.value,
          purchaseDate: validatedFields.purchaseDate,
        },
      },
    });

    console.log("Created asset:", asset);

    // Create initial valuation
    const valuation = await prisma.assetValuation.create({
      data: {
        value: parseFloat(validatedFields.value),
        date: new Date(),
        assetId: asset.id,
      },
    });

    console.log("Created valuation:", valuation);

    // Create purchase transaction
    const transaction = await prisma.assetTransaction.create({
      data: {
        type: "PURCHASE",
        amount: parseFloat(validatedFields.value),
        date: validatedFields.purchaseDate || new Date(),
        description: `Initial purchase of ${validatedFields.name}`,
        assetId: asset.id,
      },
    });

    console.log("Created transaction:", transaction);

    revalidatePath("/assets");
    return { success: true, asset };
  } catch (error) {
    console.error("Error in createAsset:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the asset",
    };
  }
}
