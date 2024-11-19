"use server";

import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

interface CreateUserInput {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
}

export async function createNewUser(): Promise<CreateUserInput | null> {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();
    if (!userId) {
      console.error("No authenticated user found");
      return null;
    }

    // Get the user details from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.error("Could not get user details from Clerk");
      return null;
    }

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      console.log("User already exists in database");
      return existingUser;
    }

    // Create new user in our database
    const newUser = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
          name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
          image: clerkUser.imageUrl,
          // Add any additional default fields here
          plan: "basic", // From your schema default
          credits: 3, // From your schema default
          language: "english", // From your schema default
        },
      });

      // Create default workspace
      await tx.workspace.create({
        data: {
          name: `${createdUser.name ?? "My"}'s Workspace`,
          users: {
            connect: { id: createdUser.id },
          },
        },
      });

      return createdUser;
    });

    console.log("Created new user:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error; // Let the caller handle the error
  }
}
