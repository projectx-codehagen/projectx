"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import type { Step } from "onborda";
import { Onborda, OnbordaProvider } from "onborda";
import { Provider as BalancerProvider } from "react-wrap-balancer";

import { TooltipProvider } from "@dingify/ui/components/tooltip";

// Example steps array
const steps: Step[] = [
  {
    icon: <>👋</>,
    title: "Step 1",
    content: <>This is the first step</>,
    selector: "#onborda-step1",
    side: "top",
    showControls: true,
    pointerPadding: 10,
    pointerRadius: 10,
    nextRoute: "/nextStep",
    prevRoute: "/previousStep",
  },
  // Add more steps as needed
];

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SessionProvider>
        <BalancerProvider>
          <TooltipProvider delayDuration={0}>
            <OnbordaProvider>
              <Onborda steps={steps} showOnborda={true}>
                {children}
              </Onborda>
            </OnbordaProvider>
          </TooltipProvider>
        </BalancerProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
