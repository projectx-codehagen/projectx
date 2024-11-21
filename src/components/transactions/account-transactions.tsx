"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CalendarIcon,
  MoreHorizontal,
  ShoppingCart,
  Utensils,
  Home,
  CreditCard,
  Briefcase,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  name: string;
  icon: LucideIcon;
}

const categoryIcons: Record<string, Category> = {
  Food: { name: "Food", icon: Utensils },
  Shopping: { name: "Shopping", icon: ShoppingCart },
  Income: { name: "Income", icon: Briefcase },
  Utilities: { name: "Utilities", icon: Zap },
  Housing: { name: "Housing", icon: Home },
  Credit: { name: "Credit", icon: CreditCard },
};

export default function AccountTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState<string | null>(
    null
  );
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      date: new Date("2023-11-15"),
      description: "Grocery Store",
      amount: -85.5,
      category: "Food",
    },
    {
      id: "2",
      date: new Date("2023-11-14"),
      description: "Salary Deposit",
      amount: 3000.0,
      category: "Income",
    },
    {
      id: "3",
      date: new Date("2023-11-13"),
      description: "Electric Bill",
      amount: -120.75,
      category: "Utilities",
    },
    {
      id: "4",
      date: new Date("2023-11-12"),
      description: "Online Shopping",
      amount: -65.99,
      category: "Shopping",
    },
    {
      id: "5",
      date: new Date("2023-11-11"),
      description: "Restaurant Dinner",
      amount: -45.0,
      category: "Food",
    },
  ]);

  const updateTransactionCategory = (
    transactionId: string,
    newCategory: string
  ) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, category: newCategory }
          : transaction
      )
    );
    setEditingTransaction(null);
  };

  // Get unique categories from transactions
  const categories = ["all", ...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderCategoryWithIcon = (category: string) => {
    const CategoryIcon = categoryIcons[category]?.icon;
    return (
      <div className="flex items-center gap-2">
        {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
        {category}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIncome.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                You've made {transactions.length} transactions this period.
              </CardDescription>
            </div>
            {/* <Button variant="outline" size="icon">
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">View calendar</span>
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {categoryFilter === "all"
                    ? "All Categories"
                    : renderCategoryWithIcon(categoryFilter)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">All Categories</div>
                </SelectItem>
                {Object.entries(categoryIcons).map(
                  ([category, { icon: Icon }]) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {category}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead className="w-[180px]">Category</TableHead>
                <TableHead className="text-right w-[150px]">Amount</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="w-[120px]">
                    {format(transaction.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="w-[200px]">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="w-[180px]">
                    {editingTransaction === transaction.id ? (
                      <Select
                        defaultValue={transaction.category}
                        onValueChange={(newCategory) => {
                          updateTransactionCategory(
                            transaction.id,
                            newCategory
                          );
                        }}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            {renderCategoryWithIcon(transaction.category)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent align="start">
                          {Object.entries(categoryIcons).map(
                            ([category, { icon: Icon }]) => (
                              <SelectItem key={category} value={category}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {category}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-primary w-[140px]"
                        onClick={() => setEditingTransaction(transaction.id)}
                      >
                        {renderCategoryWithIcon(transaction.category)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right w-[150px]">
                    <span
                      className={cn(
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {transaction.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="w-[70px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditingTransaction(transaction.id)}
                        >
                          Edit category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
