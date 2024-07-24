"use client";

import React, { useEffect, useState } from "react";
import { importBankAccounts } from "@/actions/gocardless/create-imported-transactions";
import {
  getAccountBalances,
  getAccountDetails,
  listAccounts,
} from "@/sdk/gocardless";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@dingify/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dingify/ui/components/dialog";

import type { Account } from "../tables/AccountsToSelectTable";

import { AccountsToSelectTable } from "../tables/AccountsToSelectTable";

export function AccountsDialog() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    const requisitionId = localStorage.getItem("requisition_id");
    console.log("Requisition ID from localStorage:", requisitionId);
    if (requisitionId) {
      setOpen(true);
      fetchAccounts(requisitionId);
      localStorage.removeItem("requisition_id");
    }
  }, []);

  const fetchAccounts = async (requisitionId: string) => {
    setIsLoading(true);
    try {
      console.log("Fetching accounts for requisition ID:", requisitionId);
      const requisitionData = await listAccounts(requisitionId);
      console.log("Fetched requisition data:", requisitionData);

      if (requisitionData.accounts && Array.isArray(requisitionData.accounts)) {
        const accountsWithDetails = await Promise.all(
          requisitionData.accounts.map(async (accountId) => {
            const details = await getAccountDetails(accountId);
            const balances = await getAccountBalances(accountId);
            return { ...details, balances: balances.balances };
          }),
        );
        console.log(
          "Fetched account details with balances:",
          accountsWithDetails,
        );
        setAccounts(accountsWithDetails);
        toast.success(
          `${accountsWithDetails.length} accounts fetched successfully`,
        );
      } else {
        console.error(
          "Unexpected accounts data structure:",
          requisitionData.accounts,
        );
        toast.error("Unexpected data structure received for accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch accounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportAccounts = async () => {
    const importPromise = importBankAccounts(selectedAccounts);

    toast.promise(importPromise, {
      loading: "Importing accounts...",
      success: (results: { success: boolean }[]) => {
        const successCount = results.filter((r) => r.success).length;
        setOpen(false);
        return `Successfully imported ${successCount} out of ${selectedAccounts.length} accounts`;
      },
      error: (error) => {
        console.error("Error importing accounts:", error);
        return "Failed to import accounts. Please try again.";
      },
    });

    try {
      await importPromise;
    } catch (error) {
      toast.error("Failed to import accounts. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Your Accounts</DialogTitle>
          <DialogDescription>
            Select the accounts you want to import transactions from.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">
              Fetching your accounts...
            </p>
          </div>
        ) : accounts.length > 0 ? (
          <AccountsToSelectTable
            data={accounts}
            onSelectionChange={setSelectedAccounts}
          />
        ) : (
          <div>No accounts found. Please try fetching banks again.</div>
        )}
        <DialogFooter>
          <Button
            onClick={handleImportAccounts}
            disabled={isLoading || selectedAccounts.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              `Import ${selectedAccounts.length} account${selectedAccounts.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
