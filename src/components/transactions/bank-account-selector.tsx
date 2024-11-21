"use client";

import { useState } from "react";
import { Check, CreditCard, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const bankAccounts = [
  {
    id: 1,
    name: "Main Checking",
    type: "Checking",
    balance: 5420.5,
    logo: "/placeholder.svg?height=40&width=40",
    lastUpdated: new Date(2023, 10, 15, 9, 30), // November 15, 2023, 09:30 AM
  },
  {
    id: 2,
    name: "Savings",
    type: "Savings",
    balance: 15780.25,
    logo: "/placeholder.svg?height=40&width=40",
    lastUpdated: new Date(2023, 10, 14, 18, 45), // November 14, 2023, 06:45 PM
  },
  {
    id: 3,
    name: "Investment Account",
    type: "Investment",
    balance: 32150.75,
    logo: "/placeholder.svg?height=40&width=40",
    lastUpdated: new Date(2023, 10, 13, 12, 0), // November 13, 2023, 12:00 PM
  },
  {
    id: 4,
    name: "Credit Card",
    type: "Credit",
    balance: -1250.0,
    logo: "/placeholder.svg?height=40&width=40",
    lastUpdated: new Date(2023, 10, 15, 7, 15), // November 15, 2023, 07:15 AM
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function BankAccountSelector() {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  const toggleAccount = (accountId: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const totalBalance = bankAccounts
    .filter((account) => selectedAccounts.includes(account.id))
    .reduce((sum, account) => sum + account.balance, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Bank Accounts</CardTitle>
        <CardDescription>
          Choose the accounts you want to manage in your finance application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "flex items-center space-x-4 rounded-md border p-4",
                selectedAccounts.includes(account.id) && "border-primary"
              )}
            >
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {getInitials(account.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Link
                  href={`/banking/${account.id}`}
                  className="block text-sm font-medium leading-none hover:underline"
                >
                  {account.name}
                </Link>
                <p className="text-sm text-muted-foreground">{account.type}</p>
                <p className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {formatDistanceToNow(account.lastUpdated, {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      account.balance < 0 && "text-destructive"
                    )}
                  >
                    {account.balance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
                <Button
                  variant={
                    selectedAccounts.includes(account.id)
                      ? "secondary"
                      : "ghost"
                  }
                  size="icon"
                  onClick={() => toggleAccount(account.id)}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedAccounts.includes(account.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="sr-only">
                    {selectedAccounts.includes(account.id)
                      ? "Deselect"
                      : "Select"}{" "}
                    {account.name}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {selectedAccounts.length}{" "}
            {selectedAccounts.length === 1 ? "account" : "accounts"} selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Total Balance:</span>
          <span
            className={cn(
              "text-sm font-medium",
              totalBalance < 0 && "text-destructive"
            )}
          >
            {totalBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
