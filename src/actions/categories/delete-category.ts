"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
});

export async function deleteCategory(
  input: z.infer<typeof deleteCategorySchema>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: No user found");
    }

    const validatedFields = deleteCategorySchema.parse(input);

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

    await prisma.category.delete({
      where: { id: validatedFields.id },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "An unexpected error occurred while deleting the category",
    };
  }
}
