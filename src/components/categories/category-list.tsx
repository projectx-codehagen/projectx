import {
  Home,
  ShoppingCart,
  Car,
  Lightbulb,
  Film,
  Heart,
  MoreHorizontal,
} from "lucide-react";

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

const iconMap = {
  housing: Home,
  food: ShoppingCart,
  transport: Car,
  utilities: Lightbulb,
  entertainment: Film,
  healthcare: Heart,
  other: MoreHorizontal,
};

export function CategoryList({ data }: CategoryListProps) {
  return (
    <div className="space-y-4">
      {data.map((category) => {
        const Icon =
          iconMap[category.name as keyof typeof iconMap] || MoreHorizontal;
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
                <span className="text-sm font-medium capitalize">
                  {category.name}
                </span>
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
              {category.progress.toFixed(1)}% of budget used
            </div>
          </div>
        );
      })}
    </div>
  );
}
