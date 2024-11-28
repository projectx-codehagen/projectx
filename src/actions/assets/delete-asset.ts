"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteAssetSchema = z.object({
  id: z.string().min(1, "Asset ID is required"),
});

export async function deleteAsset(input: z.infer<typeof deleteAssetSchema>) {
  try {
    console.log("Starting asset deletion process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteAssetSchema.parse(input);

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

    // Delete the asset (cascade will handle related records)
    await prisma.asset.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/assets");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAsset:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the asset",
    };
  }
}
