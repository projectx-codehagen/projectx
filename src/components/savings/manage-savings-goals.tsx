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
  deadline: z.date().optional(),
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
  });

  async function handleDelete(goalId: string) {
    try {
      setIsLoading(true);
      const result = await deleteSavingsGoal(goalId);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Goal deleted successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete goal");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof updateGoalSchema>) {
    try {
      setIsLoading(true);
      const result = await updateSavingsGoal({
        ...data,
        id: selectedGoal!.id,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Goal updated successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to update goal");
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
                onClick={() => {
                  setSelectedGoal(goal);
                  form.reset({
                    name: goal.name,
                    target: goal.target.toString(),
                    deadline: goal.deadline,
                    description: goal.description,
                  });
                }}
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
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(selectedGoal.id)}
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
                  <Button type="submit" disabled={isLoading}>
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
