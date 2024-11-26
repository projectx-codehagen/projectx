"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  CreditCard,
  Car,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateLiability } from "@/actions/liabilities/update-liability";
import { deleteLiability } from "@/actions/liabilities/delete-liability";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LiabilityTableProps {
  data?: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    liability: {
      id: string;
      name: string;
      type: string;
      amount: number;
      interestRate: number;
      monthlyPayment: number;
    };
  }[];
}

const iconMap = {
  MORTGAGE: Home,
  CREDIT_CARD: CreditCard,
  CAR_LOAN: Car,
  STUDENT_LOAN: GraduationCap,
};

const updateValueSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  monthlyPayment: z.string().min(1, "Monthly payment is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
});

type UpdateValueFormValues = z.infer<typeof updateValueSchema>;

export function LiabilityTable({ data = [] }: LiabilityTableProps) {
  const [selectedLiability, setSelectedLiability] = useState<{
    id: string;
    name: string;
    amount: number;
    type: string;
    monthlyPayment: number;
    interestRate: number;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [liabilityToDelete, setLiabilityToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<UpdateValueFormValues>({
    resolver: zodResolver(updateValueSchema),
    defaultValues: {
      amount: "",
      monthlyPayment: "",
      interestRate: "",
    },
  });

  async function onSubmit(formData: UpdateValueFormValues) {
    try {
      const result = await updateLiability({
        id: selectedLiability!.id,
        name: selectedLiability!.name,
        type: selectedLiability!.type as any,
        amount: formData.amount,
        monthlyPayment: formData.monthlyPayment,
        interestRate: formData.interestRate,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Liability updated successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to update liability");
    }
  }

  function handleEditClick(liability: typeof selectedLiability) {
    setSelectedLiability(liability);
    form.setValue("id", liability!.id);
    form.setValue("amount", liability!.amount.toString());
    form.setValue("monthlyPayment", liability!.monthlyPayment.toString());
    form.setValue("interestRate", liability!.interestRate.toString());
    setOpen(true);
  }

  async function handleDeleteClick(liability: { id: string; name: string }) {
    setLiabilityToDelete(liability);
    setShowDeleteAlert(true);
  }

  async function confirmDelete() {
    if (!liabilityToDelete) return;

    try {
      const result = await deleteLiability({ id: liabilityToDelete.id });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success(`${liabilityToDelete.name} deleted successfully`);
      setShowDeleteAlert(false);
      setLiabilityToDelete(null);
    } catch (error) {
      toast.error("Failed to delete liability");
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((payment) => {
              const Icon =
                iconMap[payment.liability.type as keyof typeof iconMap] ||
                GraduationCap;
              const showCurrentAmount =
                payment.amount !== payment.liability.amount;

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {payment.liability.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${payment.amount.toLocaleString()}
                      </p>
                      {showCurrentAmount && (
                        <p className="text-xs text-muted-foreground">
                          Balance: ${payment.liability.amount.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleEditClick({
                              id: payment.liability.id,
                              name: payment.liability.name,
                              type: payment.liability.type,
                              amount: payment.liability.amount,
                              monthlyPayment: payment.liability.monthlyPayment,
                              interestRate: payment.liability.interestRate,
                            })
                          }
                        >
                          Update Liability
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteClick({
                              id: payment.liability.id,
                              name: payment.liability.name,
                            })
                          }
                        >
                          Delete Liability
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Liability</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Liability</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {liabilityToDelete?.name} and all associated payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLiabilityToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Liability
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
