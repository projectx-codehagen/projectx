import { ShoppingBag, Coffee, Utensils, Car, Film } from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Grocery Store",
    category: "Food",
    amount: 85.32,
    icon: ShoppingBag,
    date: "2024-01-24",
    color: "hsl(var(--chart-2))",
  },
  {
    id: 2,
    name: "Coffee Shop",
    category: "Food",
    amount: 4.5,
    icon: Coffee,
    date: "2024-01-23",
    color: "hsl(var(--chart-2))",
  },
  {
    id: 3,
    name: "Restaurant",
    category: "Food",
    amount: 45.0,
    icon: Utensils,
    date: "2024-01-22",
    color: "hsl(var(--chart-2))",
  },
  {
    id: 4,
    name: "Gas Station",
    category: "Transportation",
    amount: 40.0,
    icon: Car,
    date: "2024-01-21",
    color: "hsl(var(--chart-3))",
  },
  {
    id: 5,
    name: "Movie Theater",
    category: "Entertainment",
    amount: 25.0,
    icon: Film,
    date: "2024-01-20",
    color: "hsl(var(--chart-5))",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-6">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-4">
            <div
              className="rounded-full p-2"
              style={{ backgroundColor: transaction.color }}
            >
              <transaction.icon className="h-4 w-4 text-background" />
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
              ${transaction.amount.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
