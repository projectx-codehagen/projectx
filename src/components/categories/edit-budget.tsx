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
import { cn } from "@/lib/utils";
import {
  Settings,
  Plus,
  Loader2,
  Home,
  ShoppingCart,
  Car,
  Lightbulb,
  Film,
  Heart,
  MoreHorizontal,
} from "lucide-react";

const budgetSchema = z.object({
  type: z.enum(
    [
      "housing",
      "food",
      "transport",
      "utilities",
      "entertainment",
      "healthcare",
      "other",
    ],
    {
      required_error: "Please select a category",
    }
  ),
  monthlyLimit: z.string().min(1, "Monthly limit is required"),
  dailyTarget: z.string().min(1, "Daily target is required"),
  notifications: z.boolean().default(true),
  rollover: z.boolean().default(false),
  description: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const budgetCategories = [
  {
    id: "housing",
    name: "Housing",
    icon: Home,
    description: "Rent, mortgage, and maintenance",
    color: "hsl(var(--chart-1))",
  },
  {
    id: "food",
    name: "Food",
    icon: ShoppingCart,
    description: "Groceries and dining",
    color: "hsl(var(--chart-2))",
  },
  {
    id: "transport",
    name: "Transport",
    icon: Car,
    description: "Car, fuel, and public transit",
    color: "hsl(var(--chart-3))",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: Lightbulb,
    description: "Electricity, water, and internet",
    color: "hsl(var(--chart-4))",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Film,
    description: "Movies, games, and hobbies",
    color: "hsl(var(--chart-5))",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    description: "Medical and wellness expenses",
    color: "hsl(var(--chart-6))",
  },
  {
    id: "other",
    name: "Other",
    icon: MoreHorizontal,
    description: "Miscellaneous expenses",
    color: "hsl(var(--chart-7))",
  },
];

export function EditBudgetComponent() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      monthlyLimit: "",
      dailyTarget: "",
      notifications: true,
      rollover: false,
      description: "",
    },
  });

  async function onSubmit(data: BudgetFormValues) {
    try {
      setIsLoading(true);
      // Here you would typically call your server action
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Budget updated successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error("Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCategorySelect(typeId: BudgetFormValues["type"]) {
    form.setValue("type", typeId);
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" /> Edit Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Updating budget settings...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Category" : "Budget Settings"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {budgetCategories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all ${
                  form.watch("type") === category.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() =>
                  handleCategorySelect(category.id as BudgetFormValues["type"])
                }
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div
                    className="rounded-full p-3 mb-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="monthlyLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter monthly limit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Target</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter daily target"
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
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add notes about this budget"
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
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
