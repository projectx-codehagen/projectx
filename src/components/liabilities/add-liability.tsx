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
  Home,
  CreditCard,
  Car,
  GraduationCap,
} from "lucide-react";

const liabilitySchema = z.object({
  name: z.string().min(2, {
    message: "Liability name must be at least 2 characters.",
  }),
  type: z.enum(["mortgage", "credit-card", "car-loan", "student-loan"], {
    required_error: "Please select a liability type",
  }),
  amount: z.string().min(1, "Amount is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  monthlyPayment: z.string().min(1, "Monthly payment is required"),
  startDate: z.date().optional(),
  description: z.string().optional(),
});

type LiabilityFormValues = z.infer<typeof liabilitySchema>;

const liabilityTypes = [
  {
    id: "mortgage",
    name: "Mortgage",
    icon: Home,
    description: "Home or property loans",
  },
  {
    id: "credit-card",
    name: "Credit Card",
    icon: CreditCard,
    description: "Credit card balances",
  },
  {
    id: "car-loan",
    name: "Car Loan",
    icon: Car,
    description: "Vehicle financing",
  },
  {
    id: "student-loan",
    name: "Student Loan",
    icon: GraduationCap,
    description: "Education debt",
  },
];

export function AddLiabilityComponent() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      name: "",
      amount: "",
      interestRate: "",
      monthlyPayment: "",
      description: "",
    },
  });

  async function onSubmit(data: LiabilityFormValues) {
    try {
      setIsLoading(true);
      // Here you would typically call your server action
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Liability added successfully!");
      setOpen(false);
      form.reset();
      setStep(1);
    } catch (error) {
      toast.error("Failed to add liability");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLiabilityTypeSelect(typeId: LiabilityFormValues["type"]) {
    form.setValue("type", typeId);
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Liability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Adding your liability...
              </p>
            </div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Select Liability Type" : "Liability Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {liabilityTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  form.watch("type") === type.id
                    ? "border-primary shadow-md"
                    : "hover:border-primary hover:shadow-sm"
                }`}
                onClick={() =>
                  handleLiabilityTypeSelect(
                    type.id as LiabilityFormValues["type"]
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
                    <FormLabel>Liability Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Home Mortgage" {...field} />
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
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter total amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter interest rate"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Payment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter monthly payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date (Optional)</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                        placeholder="Add details about your liability"
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
                    "Add Liability"
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
