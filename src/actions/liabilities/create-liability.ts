"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { LiabilityType, Prisma } from "@prisma/client";
import { z } from "zod";

const createLiabilitySchema = z.object({
  name: z.string().min(2, {
    message: "Liability name must be at least 2 characters.",
  }),
  type: z.enum(["MORTGAGE", "CREDIT_CARD", "CAR_LOAN", "STUDENT_LOAN"], {
    required_error: "Please select a liability type",
  }),
  amount: z.string().min(1, "Amount is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  monthlyPayment: z.string().min(1, "Monthly payment is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

export async function createLiability(
  input: z.infer<typeof createLiabilitySchema>
) {
  try {
    console.log("Starting liability creation process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createLiabilitySchema.parse(input);
    const amount = new Prisma.Decimal(validatedFields.amount);
    const interestRate = new Prisma.Decimal(validatedFields.interestRate);
    const monthlyPayment = new Prisma.Decimal(validatedFields.monthlyPayment);

    // Create the liability
    const liability = await prisma.liability.create({
      data: {
        name: validatedFields.name,
        type: validatedFields.type as LiabilityType,
        amount,
        interestRate,
        monthlyPayment,
        startDate: validatedFields.startDate,
        endDate: validatedFields.endDate,
        description: validatedFields.description,
        userId,
      },
    });

    // Create initial payment record
    await prisma.liabilityPayment.create({
      data: {
        amount: monthlyPayment,
        date: new Date(),
        type: "REGULAR",
        description: `Initial payment setup for ${validatedFields.name}`,
        liabilityId: liability.id,
      },
    });

    revalidatePath("/liabilities");
    return { success: true, liability };
  } catch (error) {
    console.error("Error in createLiability:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the liability",
    };
  }
}
