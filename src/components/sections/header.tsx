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
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const [addBorder, setAddBorder] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setAddBorder(true);
      } else {
        setAddBorder(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                  <button
                    onClick={handleDashboard}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Dashboard
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full sm:w-auto text-background flex gap-2"
                    )}
                  >
                    <Icons.logo className="h-6 w-6" />
                    Get Started for Free
                  </button>
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
