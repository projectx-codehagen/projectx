"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { LiabilityType, Prisma } from "@prisma/client";
import { z } from "zod";

const updateLiabilitySchema = z.object({
  id: z.string().min(1, "Liability ID is required"),
  name: z.string().min(2, "Liability name must be at least 2 characters."),
  type: z.enum(["MORTGAGE", "CREDIT_CARD", "CAR_LOAN", "STUDENT_LOAN"]),
  amount: z.string().min(1, "Amount is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  monthlyPayment: z.string().min(1, "Monthly payment is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
});

export async function updateLiability(
  input: z.infer<typeof updateLiabilitySchema>
) {
  try {
    console.log("Starting liability update process");

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateLiabilitySchema.parse(input);

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

    const newAmount = new Prisma.Decimal(validatedFields.amount);
    const newInterestRate = new Prisma.Decimal(validatedFields.interestRate);
    const newMonthlyPayment = new Prisma.Decimal(
      validatedFields.monthlyPayment
    );

    // Update the liability
    const liability = await prisma.liability.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        type: validatedFields.type as LiabilityType,
        amount: newAmount,
        interestRate: newInterestRate,
        monthlyPayment: newMonthlyPayment,
        startDate: validatedFields.startDate,
        endDate: validatedFields.endDate,
        description: validatedFields.description,
      },
    });

    // Create new payment record if monthly payment changed
    if (!existingLiability.monthlyPayment.equals(newMonthlyPayment)) {
      await prisma.liabilityPayment.create({
        data: {
          amount: newMonthlyPayment,
          date: new Date(),
          type: "REGULAR",
          description: `Payment amount updated for ${validatedFields.name}`,
          liabilityId: liability.id,
        },
      });
    }

    revalidatePath("/liabilities");
    return { success: true, liability };
  } catch (error) {
    console.error("Error in updateLiability:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the liability",
    };
  }
}
