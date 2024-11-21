"use client"

import { useState } from "react"
import { Check, CreditCard, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

// ... (keep the bankAccounts and monthlyData arrays as they were)

export default function BankAccountOverview() {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([])

  const toggleAccount = (accountId: number) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    )
  }

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0)
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0)

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <p className="text-xs text-muted-foreground">
              +7.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Monthly comparison for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Your Bank Accounts</CardTitle>
          <CardDescription>Choose the accounts you want to manage in your finance application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {bankAccounts.map(account => (
              <div
                key={account.id}
                className={cn(
                  "flex items-center space-x-4 rounded-md border p-4",
                  selectedAccounts.includes(account.id) && "border-primary"
                )}
              >
                <img
                  src={account.logo}
                  alt={`${account.name} logo`}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.type}</p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatDistanceToNow(account.lastUpdated, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className={cn(
                      "text-sm font-medium",
                      account.balance < 0 && "text-destructive"
                    )}>
                      {account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                  <Button
                    variant={selectedAccounts.includes(account.id) ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => toggleAccount(account.id)}
                  >
                    <Check className={cn(
                      "h-4 w-4",
                      selectedAccounts.includes(account.id) ? "opacity-100" : "opacity-0"
                    )} />
                    <span className="sr-only">
                      {selectedAccounts.includes(account.id) ? "Deselect" : "Select"} {account.name}
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
              {selectedAccounts.length} {selectedAccounts.length === 1 ? "account" : "accounts"} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Selected Balance:</span>
            <span className={cn(
              "text-sm font-medium",
              selectedAccounts.reduce((sum, id) => sum + bankAccounts.find(acc => acc.id === id)!.balance, 0) < 0 && "text-destructive"
            )}>
              {selectedAccounts.reduce((sum, id) => sum + bankAccounts.find(acc => acc.id === id)!.balance, 0)
                .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

