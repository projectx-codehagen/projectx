"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Tag } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { CategorySelect } from "@/components/categories/category-select";
import { updateTransactionCategory } from "@/actions/categories/manage-categories";
import {
  ShoppingCart,
  Utensils,
  Home,
  CreditCard,
  Briefcase,
  Zap,
  Car,
  Plane,
  Gift,
  Coffee,
  type LucideIcon,
} from "lucide-react";

interface AccountTransactionsProps {
  transactions: {
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: string;
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  }[];
}

const categoryIcons: Record<string, LucideIcon> = {
  FOOD: Utensils,
  SHOPPING: ShoppingCart,
  INCOME: Briefcase,
  UTILITIES: Zap,
  HOUSING: Home,
  CREDIT: CreditCard,
  TRANSPORTATION: Car,
  TRAVEL: Plane,
  GIFTS: Gift,
  ENTERTAINMENT: Coffee,
};

function getDefaultCategory(type: string, description: string) {
  if (type === "CREDIT") {
    return {
      id: "income",
      name: "INCOME",
      icon: "income",
    };
  }

  // You could add more automatic categorization based on description keywords
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("grocery") || lowerDesc.includes("food")) {
    return {
      id: "food",
      name: "FOOD",
      icon: "food",
    };
  }
  if (lowerDesc.includes("utility") || lowerDesc.includes("bill")) {
    return {
      id: "utilities",
      name: "UTILITIES",
      icon: "utilities",
    };
  }
  // ... add more cases as needed

  return null;
}

function renderCategoryWithIcon(
  category: { name: string; icon: string } | null,
  type: string,
  description: string
) {
  // If no category, try to get a default one based on transaction type
  const effectiveCategory = category || getDefaultCategory(type, description);

  if (!effectiveCategory) {
    return (
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Uncategorized</span>
      </div>
    );
  }

  const IconComponent =
    categoryIcons[effectiveCategory.name.toUpperCase()] || ShoppingCart;
  const formattedName = effectiveCategory.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div className="flex items-center gap-2">
      <IconComponent className="h-4 w-4 text-muted-foreground" />
      <span>{formattedName}</span>
    </div>
  );
}

export default function AccountTransactions({
  transactions,
}: AccountTransactionsProps) {
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null
  );

  const handleCategoryUpdate = async (categoryId: string) => {
    if (!editingTransaction) return;

    try {
      const result = await updateTransactionCategory(
        editingTransaction,
        categoryId
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Category updated successfully");
      setEditingTransaction(null);
      // TODO: Add refresh logic here
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {editingTransaction === transaction.id ? (
                    <CategorySelect
                      onSelect={(newCategory) => {
                        handleCategoryUpdate(newCategory);
                        setEditingTransaction(null);
                      }}
                      currentCategoryId={transaction.category?.id}
                    />
                  ) : (
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-primary"
                      onClick={() => setEditingTransaction(transaction.id)}
                    >
                      {renderCategoryWithIcon(
                        transaction.category,
                        transaction.type,
                        transaction.description
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      transaction.type === "DEBIT" ? "text-destructive" : ""
                    }
                  >
                    {transaction.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingTransaction(transaction.id)}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        Update Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
