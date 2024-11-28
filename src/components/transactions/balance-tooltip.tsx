"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BalanceTooltipProps {
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  lastUpdated: Date;
}

export function BalanceTooltip({
  balance,
  availableBalance,
  pendingBalance,
  lastUpdated,
}: BalanceTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-muted-foreground">Current:</span>
            <span>
              {balance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
            <span className="text-muted-foreground">Available:</span>
            <span>
              {availableBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
            <span className="text-muted-foreground">Pending:</span>
            <span>
              {pendingBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated:{" "}
            {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}