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
import { MoreHorizontal, Tag, CheckCircle, Pencil, Plus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIZATION_RULES,
  suggestCategory,
} from "@/lib/utils/transaction-categorization";
import { validateTransactionCategory } from "@/actions/categories/validate-transaction-category";
import { cn } from "@/lib/utils";

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
    categoryValidated?: boolean;
  }[];
  onTransactionUpdate: () => Promise<void>;
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

function getConfidenceBadgeStyles(confidence: number) {
  if (confidence >= 0.8) {
    return "bg-green-100 hover:bg-green-200 text-green-700 border-green-300";
  }
  if (confidence >= 0.5) {
    return "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300";
  }
  return "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300";
}

function getConfidenceLabel(confidence: number) {
  if (confidence >= 0.8) return "High Match";
  if (confidence >= 0.5) return "Possible Match";
  return "Suggested";
}

function renderCategoryWithIcon(
  transaction: {
    id: string;
    category?: { name: string; icon: string } | null;
    type: string;
    description: string;
    amount: number;
    categoryValidated?: boolean;
  },
  onApproveCategory: (transactionId: string, categoryId: string) => void,
  setEditingTransaction: (id: string | null) => void
) {
  const suggestedCategory = !transaction.categoryValidated
    ? suggestCategory(
        transaction.description,
        transaction.amount,
        transaction.type as "CREDIT" | "DEBIT"
      )
    : null;

  const effectiveCategory =
    transaction.category ||
    (suggestedCategory
      ? CATEGORIZATION_RULES.find((r) => r.id === suggestedCategory.categoryId)
      : null);

  const IconComponent =
    effectiveCategory && categoryIcons[effectiveCategory.name.toUpperCase()]
      ? categoryIcons[effectiveCategory.name.toUpperCase()]
      : ShoppingCart;

  return (
    <div className="flex items-center gap-2">
      {!transaction.categoryValidated && suggestedCategory && (
        <Badge
          variant="outline"
          className={cn(
            "mr-2 cursor-pointer transition-all hover:scale-105",
            getConfidenceBadgeStyles(suggestedCategory.confidence)
          )}
          onClick={(e) => {
            e.stopPropagation();
            onApproveCategory(transaction.id, suggestedCategory.categoryId);
          }}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Accept Suggestion
        </Badge>
      )}
      <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
        <span>
          {effectiveCategory
            ? effectiveCategory.name
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "Uncategorized"}
        </span>
      </div>
    </div>
  );
}

export default function AccountTransactions({
  transactions,
  onTransactionUpdate,
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
      // Refresh the data
      await onTransactionUpdate();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleApproveCategory = async (
    transactionId: string,
    categoryId: string
  ) => {
    try {
      // Update the category
      const updateResult = await updateTransactionCategory(
        transactionId,
        categoryId
      );
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }

      toast.success("Category approved successfully");
      // Refresh the data
      await onTransactionUpdate();
    } catch (error) {
      toast.error("Failed to approve category");
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
                      }}
                      currentCategoryId={transaction.category?.id}
                    />
                  ) : (
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-primary"
                      onClick={() => setEditingTransaction(transaction.id)}
                    >
                      {renderCategoryWithIcon(
                        transaction,
                        handleApproveCategory,
                        setEditingTransaction
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
