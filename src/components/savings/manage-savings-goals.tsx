"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  Settings,
  PiggyBank,
  Wallet,
  Home,
  Target,
} from "lucide-react";
import { updateSavingsGoal } from "@/actions/savings/update-savings-goal";
import { deleteSavingsGoal } from "@/actions/savings/delete-savings-goal";

interface ManageSavingsGoalsProps {
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

const updateGoalSchema = z.object({
  id: z.string().min(1, "Goal ID is required"),
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  target: z.string().min(1, "Target amount is required"),
  description: z.string().optional(),
});

const goalTypes = [
  {
    id: "EMERGENCY_FUND",
    name: "Emergency Fund",
    icon: PiggyBank,
    description: "3-6 months of living expenses",
  },
  {
    id: "RETIREMENT",
    name: "Retirement",
    icon: Wallet,
    description: "Long-term savings for retirement",
  },
  {
    id: "DOWN_PAYMENT",
    name: "Down Payment",
    icon: Home,
    description: "Saving for a house down payment",
  },
  {
    id: "CUSTOM",
    name: "Custom Goal",
    icon: Target,
    description: "Create a custom savings goal",
  },
];

export function ManageSavingsGoals({ goals }: ManageSavingsGoalsProps) {
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<(typeof goals)[0] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updateGoalSchema>>({
    resolver: zodResolver(updateGoalSchema),
    defaultValues: {
      name: "",
      target: "",
      description: "",
    },
  });

  function handleGoalSelect(goal: (typeof goals)[0]) {
    setSelectedGoal(goal);
    form.reset({
      id: goal.id,
      name: goal.name,
      target: goal.target.toString(),
      description: goal.description ?? "",
    });
  }

  async function handleDelete(goalId: string) {
    try {
      setIsLoading(true);
      console.log("Deleting goal with ID:", goalId);

      const result = await deleteSavingsGoal(goalId);
      console.log("Delete result:", result);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Goal deleted successfully!");
      setSelectedGoal(null);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete goal"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof updateGoalSchema>) {
    if (!selectedGoal) return;

    try {
      setIsLoading(true);
      console.log("Updating goal:", data);

      const result = await updateSavingsGoal({
        id: selectedGoal.id,
        name: data.name,
        target: data.target,
        description: data.description,
      });

      console.log("Update result:", result);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Goal updated successfully!");
      setSelectedGoal(null);
      setOpen(false);
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update goal"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" /> Manage Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Select Goal to Manage</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {goals.map((goal) => {
            const GoalIcon =
              goalTypes.find((t) => t.id === goal.type)?.icon || Target;
            return (
              <Card
                key={`goal-card-${goal.id}`}
                className={`cursor-pointer transition-all ${
                  selectedGoal?.id === goal.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() => handleGoalSelect(goal)}
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div key={`goal-icon-${goal.id}`}>
                    <GoalIcon className="h-10 w-10 mb-3" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">{goal.name}</h3>
                  <div className="space-y-2 w-full">
                    <div className="text-xs text-muted-foreground">
                      ${goal.current.toLocaleString()} / $
                      {goal.target.toLocaleString()}
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          goal.progress >= 100
                            ? "bg-green-500"
                            : "bg-[hsl(var(--primary))]"
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {goal.progress.toFixed(1)}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedGoal && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., House Down Payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter target amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Saving for a house down payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => selectedGoal && handleDelete(selectedGoal.id)}
                  disabled={isLoading}
                >
                  Delete Goal
                </Button>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedGoal(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedGoal}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
