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
  Plus,
  Loader2,
  PiggyBank,
  Wallet,
  Home,
  Target,
} from "lucide-react";
import { createSavingsGoal } from "@/actions/savings/create-savings-goal";

const goalSchema = z.object({
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  type: z.enum(["EMERGENCY_FUND", "RETIREMENT", "DOWN_PAYMENT", "CUSTOM"], {
    required_error: "Please select a goal type",
  }),
  target: z.string().min(1, "Target amount is required"),
  deadline: z.date().optional(),
  description: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

const goalTypes = [
  {
    id: "EMERGENCY_FUND",
    name: "Emergency Fund",
    icon: PiggyBank,
    description: "3-6 months of living expenses",
    defaults: {
      name: "Emergency Fund",
      target: "15000",
      description: "3-6 months of living expenses for unexpected costs",
    },
  },
  {
    id: "RETIREMENT",
    name: "Retirement",
    icon: Wallet,
    description: "Long-term savings for retirement",
    defaults: {
      name: "Retirement Savings",
      target: "500000",
      description: "Long-term savings for comfortable retirement",
    },
  },
  {
    id: "DOWN_PAYMENT",
    name: "Down Payment",
    icon: Home,
    description: "Saving for a house down payment",
    defaults: {
      name: "House Down Payment",
      target: "50000",
      description: "Saving for a house down payment (20% of house value)",
    },
  },
  {
    id: "CUSTOM",
    name: "Custom Goal",
    icon: Target,
    description: "Create a custom savings goal",
    defaults: {
      name: "",
      target: "",
      description: "",
    },
  },
];

export function AddSavingsGoal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      target: "",
      description: "",
    },
  });

  async function onSubmit(data: GoalFormValues) {
    try {
      setIsLoading(true);

      const result = await createSavingsGoal({
        name: data.name,
        type: data.type,
        target: data.target,
        deadline: data.deadline,
        description: data.description,
      });

      if (!result.success) {
        if (Array.isArray(result.error)) {
          result.error.forEach((error) => {
            form.setError(error.path[0] as any, {
              message: error.message,
            });
          });
          toast.error("Please check the form for errors");
          return;
        }
        throw new Error(result.error);
      }

      toast.success("Savings goal created successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error("Failed to create savings goal");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoalTypeSelect(typeId: GoalFormValues["type"]) {
    const selectedType = goalTypes.find((type) => type.id === typeId);

    if (selectedType) {
      form.reset({
        ...form.getValues(),
        type: typeId,
        name: selectedType.defaults.name,
        target: selectedType.defaults.target,
        description: selectedType.defaults.description,
      });
    }

    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Creating your goal...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Goal Type" : "Goal Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {goalTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  form.watch("type") === type.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() =>
                  handleGoalTypeSelect(type.id as GoalFormValues["type"])
                }
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <type.icon className="h-10 w-10 mb-3" />
                  <h3 className="text-base font-semibold mb-1">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields */}
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add details about your goal"
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
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Goal"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
