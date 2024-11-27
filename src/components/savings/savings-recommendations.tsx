"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Target, Briefcase } from "lucide-react";

interface SavingsRecommendationsProps {
  data: {
    type: "INCREASE" | "GOAL" | "DIVERSIFY";
    title: string;
    description: string;
    action: string;
    priority: "high" | "medium" | "low";
  }[];
}

const iconMap = {
  INCREASE: ArrowUpCircle,
  GOAL: Target,
  DIVERSIFY: Briefcase,
};

export function SavingsRecommendations({ data }: SavingsRecommendationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {data.map((rec) => {
            const Icon = iconMap[rec.type];
            return (
              <div key={rec.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-1.5 ${
                      rec.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : rec.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-medium">{rec.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
                <Button
                  size="sm"
                  variant={rec.priority === "high" ? "default" : "outline"}
                  disabled
                >
                  {rec.action}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
