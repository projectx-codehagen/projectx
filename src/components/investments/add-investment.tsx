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
  Plus,
  Loader2,
  BarChart2,
  Wallet2,
  LineChart,
  Briefcase,
} from "lucide-react";

const investmentSchema = z.object({
  name: z.string().min(2, {
    message: "Investment name must be at least 2 characters.",
  }),
  type: z.enum(["stocks", "crypto", "etf", "other"], {
    required_error: "Please select an investment type",
  }),
  amount: z.string().min(1, "Amount is required"),
  shares: z.string().optional(),
  description: z.string().optional(),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

const investmentTypes = [
  {
    id: "stocks",
    name: "Stocks",
    icon: BarChart2,
    description: "Individual company shares",
  },
  {
    id: "crypto",
    name: "Crypto",
    icon: Wallet2,
    description: "Cryptocurrency investments",
  },
  {
    id: "etf",
    name: "ETF",
    icon: LineChart,
    description: "Exchange-traded funds",
  },
  {
    id: "other",
    name: "Other",
    icon: Briefcase,
    description: "Other investment types",
  },
];

export function AddInvestmentComponent() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: "",
      amount: "",
      shares: "",
      description: "",
    },
  });

  async function onSubmit(data: InvestmentFormValues) {
    try {
      setIsLoading(true);
      // Here you would typically call your server action
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Investment added successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error("Failed to add investment");
    } finally {
      setIsLoading(false);
    }
  }

  function handleInvestmentTypeSelect(typeId: InvestmentFormValues["type"]) {
    form.setValue("type", typeId);
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Adding your investment...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Investment Type" : "Investment Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {investmentTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  form.watch("type") === type.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() =>
                  handleInvestmentTypeSelect(
                    type.id as InvestmentFormValues["type"]
                  )
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Apple Inc. (AAPL)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter investment amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Shares (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter number of shares"
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
                        placeholder="Add details about your investment"
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
                      Processing...
                    </>
                  ) : (
                    "Add Investment"
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
