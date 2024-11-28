"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase, MoreHorizontal } from "lucide-react";
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
import { updateAsset } from "@/actions/assets/update-asset";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { deleteAsset } from "@/actions/assets/delete-asset";
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

interface AssetTableProps {
  data?: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    asset: {
      id: string;
      name: string;
      type: string;
      value: number;
    };
  }[];
}

const iconMap = {
  REAL_ESTATE: Home,
  VEHICLE: Car,
  PRECIOUS_METALS: Coins,
  OTHER: Briefcase,
};

const updateValueSchema = z.object({
  id: z.string(),
  value: z.string().min(1, "Value is required"),
});

type UpdateValueFormValues = z.infer<typeof updateValueSchema>;

export function AssetTable({ data = [] }: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
    value: number;
    type: string;
  } | null>(null);
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<UpdateValueFormValues>({
    resolver: zodResolver(updateValueSchema),
    defaultValues: {
      value: "",
    },
  });

  async function onSubmit(formData: UpdateValueFormValues) {
    try {
      const result = await updateAsset({
        id: selectedAsset!.id,
        name: selectedAsset!.name,
        type: selectedAsset!.type as any,
        value: formData.value,
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Asset value updated successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to update asset value");
    }
  }

  function handleEditClick(asset: typeof selectedAsset) {
    setSelectedAsset(asset);
    form.setValue("id", asset!.id);
    form.setValue("value", asset!.value.toString());
    setOpen(true);
  }

  async function handleDeleteClick(asset: { id: string; name: string }) {
    setAssetToDelete(asset);
    setShowDeleteAlert(true);
  }

  async function confirmDelete() {
    if (!assetToDelete) return;

    try {
      const result = await deleteAsset({ id: assetToDelete.id });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success(`${assetToDelete.name} deleted successfully`);
      setShowDeleteAlert(false);
      setAssetToDelete(null);
    } catch (error) {
      toast.error("Failed to delete asset");
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((transaction) => {
              const Icon =
                iconMap[transaction.asset.type as keyof typeof iconMap] ||
                Briefcase;
              const showCurrentValue =
                transaction.amount !== transaction.asset.value;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${transaction.amount.toLocaleString()}
                      </p>
                      {showCurrentValue && (
                        <p className="text-xs text-muted-foreground">
                          Current: ${transaction.asset.value.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString([], {
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
                              id: transaction.asset.id,
                              name: transaction.asset.name,
                              value: transaction.asset.value,
                              type: transaction.asset.type,
                            })
                          }
                        >
                          Update Value
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteClick({
                              id: transaction.asset.id,
                              name: transaction.asset.name,
                            })
                          }
                        >
                          Delete Asset
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
            <DialogTitle>Update Asset Value</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter new value"
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
                <Button type="submit">Update Value</Button>
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
              {assetToDelete?.name} and all associated transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssetToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
