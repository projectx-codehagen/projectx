"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
