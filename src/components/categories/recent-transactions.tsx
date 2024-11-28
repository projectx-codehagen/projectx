import { CATEGORIES } from "@/lib/config/categories";
import { HelpCircle, type LucideIcon } from "lucide-react";

interface RecentTransactionsProps {
  data: {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: Date;
    icon: string;
    color: string;
  }[];
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  // Get icon from our category config
  const getIcon = (categoryName: string): LucideIcon => {
    const category = CATEGORIES.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.icon || HelpCircle;
  };

  return (
    <div className="space-y-6">
      {data.map((transaction) => {
        const Icon = getIcon(transaction.category);

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-4">
              <div
                className="rounded-full p-2"
                style={{ backgroundColor: transaction.color }}
              >
                <Icon className="h-4 w-4 text-background" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                ${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
