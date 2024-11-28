"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, CreditCard, Car, GraduationCap } from "lucide-react";

interface LiabilityCardsProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

const placeholderLiabilities = [
  {
    id: "MORTGAGE",
    name: "Mortgage",
    icon: Home,
    description: "Home and property loans",
  },
  {
    id: "CREDIT_CARD",
    name: "Credit Card",
    icon: CreditCard,
    description: "Credit card debt",
  },
  {
    id: "CAR_LOAN",
    name: "Car Loan",
    icon: Car,
    description: "Vehicle financing",
  },
  {
    id: "STUDENT_LOAN",
    name: "Student Loan",
    icon: GraduationCap,
    description: "Education loans",
  },
];

export function LiabilityCards({ data = [] }: LiabilityCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {placeholderLiabilities.map((liability) => {
        // Find matching data for this liability type
        const liabilityData = data?.find(
          (d) => d.originalName === liability.id
        );

        if (liabilityData) {
          // Render card with real data
          return (
            <Card key={liability.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <liability.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm font-medium">
                      {liabilityData.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-2xl font-bold">
                      ${(liabilityData.value / 1000).toFixed(0)}K
                    </div>
                    <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs bg-destructive/10 text-destructive">
                      {liabilityData.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-destructive/50"
                      style={{ width: `${liabilityData.percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

        // Render placeholder card
        return (
          <Card
            key={liability.id}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <liability.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">{liability.name}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold text-muted-foreground">
                    $0<span className="text-xl">.00</span>
                  </div>
                  <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-xs bg-muted text-muted-foreground">
                    0%
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-destructive/50 w-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {liability.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
