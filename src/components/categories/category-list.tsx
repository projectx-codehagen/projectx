import {
  Home,
  ShoppingCart,
  Car,
  Lightbulb,
  Film,
  Heart,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  {
    name: "Housing",
    icon: Home,
    amount: 1500,
    budget: 1600,
    color: "hsl(var(--chart-1))",
    progress: 93.75,
  },
  {
    name: "Food",
    icon: ShoppingCart,
    amount: 500,
    budget: 600,
    color: "hsl(var(--chart-2))",
    progress: 83.33,
  },
  {
    name: "Transportation",
    icon: Car,
    amount: 300,
    budget: 400,
    color: "hsl(var(--chart-3))",
    progress: 75,
  },
  {
    name: "Utilities",
    icon: Lightbulb,
    amount: 200,
    budget: 250,
    color: "hsl(var(--chart-4))",
    progress: 80,
  },
  {
    name: "Entertainment",
    icon: Film,
    amount: 150,
    budget: 200,
    color: "hsl(var(--chart-5))",
    progress: 75,
  },
  {
    name: "Healthcare",
    icon: Heart,
    amount: 100,
    budget: 150,
    color: "hsl(var(--chart-6))",
    progress: 66.67,
  },
  {
    name: "Other",
    icon: MoreHorizontal,
    amount: 250,
    budget: 300,
    color: "hsl(var(--chart-7))",
    progress: 83.33,
  },
];

export function CategoryList() {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-full p-2"
                style={{ backgroundColor: category.color }}
              >
                <category.icon className="h-4 w-4 text-background" />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ${category.amount.toLocaleString()} / $
              {category.budget.toLocaleString()}
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${category.progress}%`,
                backgroundColor: category.color,
              }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {category.progress}% of budget used
          </div>
        </div>
      ))}
    </div>
  );
}
