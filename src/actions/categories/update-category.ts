"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
});

export async function updateCategory(
  input: z.infer<typeof updateCategorySchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = updateCategorySchema.parse(input);

    // Verify category ownership
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: validatedFields.id,
        userId,
      },
    });

    if (!existingCategory) {
      throw new Error("Category not found or unauthorized");
    }

    const category = await prisma.category.update({
      where: { id: validatedFields.id },
      data: {
        name: validatedFields.name,
        icon: validatedFields.icon,
      },
    });

    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Error in updateCategory:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating the category",
    };
  }
}
