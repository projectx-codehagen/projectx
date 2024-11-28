import { CATEGORIES } from "@/lib/config/categories";
import { MoreHorizontal, type LucideIcon } from "lucide-react";

interface CategoryListProps {
  data: {
    name: string;
    amount: number;
    budget: number;
    color: string;
    percentage: number;
    progress: number;
  }[];
}

// Create icon map from our centralized CATEGORIES config
const iconMap: Record<string, LucideIcon> = CATEGORIES.reduce(
  (acc, category) => ({
    ...acc,
    [category.name]: category.icon,
  }),
  {}
);

export function CategoryList({ data }: CategoryListProps) {
  return (
    <div className="space-y-4">
      {data.map((category) => {
        // Find matching icon, fallback to MoreHorizontal
        const Icon = iconMap[category.name] || MoreHorizontal;

        return (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full p-2"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="h-4 w-4 text-background" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ${Math.abs(category.amount).toLocaleString()} / $
                {category.budget.toLocaleString()}
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.abs(category.progress), 100)}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {Math.abs(category.progress).toFixed(1)}% of budget used
            </div>
          </div>
        );
      })}
    </div>
  );
}
