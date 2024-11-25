"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
});

export async function createCategory(
  input: z.infer<typeof createCategorySchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = createCategorySchema.parse(input);

    // Check for duplicate category
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: validatedFields.name,
        userId,
      },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const category = await prisma.category.create({
      data: {
        name: validatedFields.name,
        icon: validatedFields.icon,
        userId,
      },
    });

    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Error in createCategory:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while creating the category",
    };
  }
}
