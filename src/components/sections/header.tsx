"use client";

import Drawer from "@/components/drawer";
import { Icons } from "@/components/icons";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { createNewUser } from "@/actions/user/create-new-user";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setAddBorder(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function handleUserCreation() {
      if (isSignedIn) {
        try {
          await createNewUser();
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    }

    if (isLoaded) {
      handleUserCreation();
    }
  }, [isSignedIn, isLoaded]);

  // Navigation handlers
  const handleSignIn = () => router.push("/sign-in");
  const handleSignUp = () => router.push("/sign-up");
  const handleDashboard = () => router.push("/dashboard");

  return (
    <header className="relative sticky top-0 z-50 py-2 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center container">
        <Link
          href="/"
          title={siteConfig.name}
          className="relative mr-6 flex items-center space-x-2"
        >
          <Icons.logo className="w-auto h-[40px]" />
          <span className="font-bold text-xl">{siteConfig.name}</span>
        </Link>

        <div className="hidden lg:block">
          <div className="flex items-center">
            <nav className="mr-10">
              <Menu />
            </nav>

            <div className="gap-2 flex">
              {isSignedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className={buttonVariants({ variant: "outline" })}>
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full sm:w-auto text-background flex gap-2"
                      )}
                    >
                      <Icons.logo className="h-6 w-6" />
                      Get Started for Free
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 cursor-pointer block lg:hidden">
          <Drawer />
        </div>
      </div>
      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}
