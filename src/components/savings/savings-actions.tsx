"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Target, Calculator } from "lucide-react";
import { ManageSavingsGoals } from "@/components/savings/manage-savings-goals";

interface SavingsActionsProps {
  goals: {
    id: string;
    name: string;
    type: string;
    target: number;
    current: number;
    progress: number;
    deadline?: Date;
    description?: string;
  }[];
}

export function SavingsActions({ goals }: SavingsActionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Manage Goals</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Review and adjust your savings goals.
            </p>
            <ManageSavingsGoals goals={goals} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Set Goals</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Create or modify your savings goals.
            </p>
            <Button size="sm" variant="outline" disabled>
              Manage Goals
              <span className="ml-2 text-xs">(Coming soon)</span>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Calculate Needs</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use our calculator to plan your savings.
            </p>
            <Button size="sm" variant="outline" disabled>
              Open Calculator
              <span className="ml-2 text-xs">(Coming soon)</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
