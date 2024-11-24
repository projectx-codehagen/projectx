"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, CreditCard, Car, GraduationCap } from "lucide-react";
import { TotalLiabilitiesChart } from "./total-liabilities-chart";

const liabilities = [
  {
    name: "Mortgage",
    icon: Home,
    value: 350000,
    change: "-1.2%",
    trend: "down" as const,
  },
  {
    name: "Credit Cards",
    icon: CreditCard,
    value: 5000,
    change: "-2.5%",
    trend: "down" as const,
  },
  {
    name: "Car Loan",
    icon: Car,
    value: 25000,
    change: "-1.8%",
    trend: "down" as const,
  },
  {
    name: "Student Loans",
    icon: GraduationCap,
    value: 70000,
    change: "-0.8%",
    trend: "down" as const,
  },
];

export function LiabilityCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {liabilities.map((liability) => (
        <Card key={liability.name}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <liability.icon className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">{liability.name}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">
                  ${(liability.value / 1000).toFixed(0)}K
                </div>
                <div
                  className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs bg-destructive/10 text-destructive`}
                >
                  {liability.change}
                </div>
              </div>
              <div className="h-[60px]">
                <TotalLiabilitiesChart variant="secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
