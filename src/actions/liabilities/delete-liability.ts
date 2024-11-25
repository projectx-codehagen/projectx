"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteLiabilitySchema = z.object({
  id: z.string().min(1, "Liability ID is required"),
});

export async function deleteLiability(
  input: z.infer<typeof deleteLiabilitySchema>
) {
  try {
    console.log("Starting liability deletion process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteLiabilitySchema.parse(input);

    // Verify liability ownership
    const existingLiability = await prisma.liability.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
    });

    if (!existingLiability) {
      throw new Error("Liability not found or unauthorized");
    }

    // Delete the liability (cascade will handle related records)
    await prisma.liability.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/liabilities");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteLiability:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the liability",
    };
  }
}
