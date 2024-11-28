"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  Wallet2,
  LineChart,
  Briefcase,
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
import { updateInvestment } from "@/actions/investments/update-investment";
import { deleteInvestment } from "@/actions/investments/delete-investment";
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

interface PositionsTableProps {
  data?: {
    id: string;
    type: string;
    amount: number;
    shares: number | null;
    price: number;
    date: Date;
    description: string;
    investment: {
      id: string;
      name: string;
      type: string;
      amount: number;
      shares: number | null;
      purchasePrice: number | null;
      currentPrice: number | null;
    };
  }[];
}

const iconMap = {
  STOCKS: BarChart2,
  CRYPTO: Wallet2,
  ETF: LineChart,
  OTHER: Briefcase,
};

const updateValueSchema = z.object({
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  shares: z.string().optional(),
  currentPrice: z.string().optional(),
});

type UpdateValueFormValues = z.infer<typeof updateValueSchema>;

export function PositionsTable({ data = [] }: PositionsTableProps) {
  const [selectedInvestment, setSelectedInvestment] = useState<{
    id: string;
    name: string;
    type: string;
    amount: number;
    shares: number | null;
    currentPrice: number | null;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<UpdateValueFormValues>({
    resolver: zodResolver(updateValueSchema),
    defaultValues: {
      amount: "",
      shares: "",
      currentPrice: "",
    },
  });

  async function onSubmit(formData: UpdateValueFormValues) {
    try {
      const result = await updateInvestment({
        id: selectedInvestment!.id,
        name: selectedInvestment!.name,
        type: selectedInvestment!.type as any,
        amount: formData.amount,
        shares: formData.shares,
        currentPrice: formData.currentPrice,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Investment updated successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to update investment");
    }
  }

  function handleEditClick(investment: typeof selectedInvestment) {
    setSelectedInvestment(investment);
    form.setValue("id", investment!.id);
    form.setValue("amount", investment!.amount.toString());
    if (investment!.shares) {
      form.setValue("shares", investment!.shares.toString());
    }
    if (investment!.currentPrice) {
      form.setValue("currentPrice", investment!.currentPrice.toString());
    }
    setOpen(true);
  }

  async function handleDeleteClick(investment: { id: string; name: string }) {
    setInvestmentToDelete(investment);
    setShowDeleteAlert(true);
  }

  async function confirmDelete() {
    if (!investmentToDelete) return;

    try {
      const result = await deleteInvestment({ id: investmentToDelete.id });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success(`${investmentToDelete.name} deleted successfully`);
      setShowDeleteAlert(false);
      setInvestmentToDelete(null);
    } catch (error) {
      toast.error("Failed to delete investment");
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((position) => {
              const Icon =
                iconMap[position.investment.type as keyof typeof iconMap] ||
                Briefcase;
              const showShares = position.shares !== null;

              return (
                <div
                  key={position.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {position.investment.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {showShares
                          ? `${position.shares} shares @ $${position.price}`
                          : position.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${position.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(position.date).toLocaleDateString([], {
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
                              id: position.investment.id,
                              name: position.investment.name,
                              type: position.investment.type,
                              amount: position.investment.amount,
                              shares: position.investment.shares,
                              currentPrice: position.investment.currentPrice,
                            })
                          }
                        >
                          Update Position
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteClick({
                              id: position.investment.id,
                              name: position.investment.name,
                            })
                          }
                        >
                          Delete Position
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
            <DialogTitle>Update Position</DialogTitle>
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
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Shares</FormLabel>
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
                name="currentPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter current price"
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
                <Button type="submit">Update Position</Button>
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
              {investmentToDelete?.name} and all associated transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvestmentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Position
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
