"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const getLiabilitySchema = z.object({
  id: z.string().min(1, "Liability ID is required"),
});

export async function getLiability(input: z.infer<typeof getLiabilitySchema>) {
  try {
    console.log("Starting liability fetch process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = getLiabilitySchema.parse(input);

    const liability = await prisma.liability.findFirst({
      where: {
        id: validatedFields.id,
        userId: userId,
      },
      include: {
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!liability) {
      throw new Error("Liability not found or unauthorized");
    }

    return { success: true, liability };
  } catch (error) {
    console.error("Error in getLiability:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the liability",
    };
  }
}
