"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/actions/categories/manage-categories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Utensils,
  Home,
  CreditCard,
  Briefcase,
  Zap,
  Car,
  Plane,
  Gift,
  Coffee,
  type LucideIcon,
} from "lucide-react";

interface CategorySelectProps {
  onSelect: (categoryId: string) => void;
  currentCategoryId?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

// Map of category names to Lucide icons (case-insensitive)
const categoryIcons: Record<string, LucideIcon> = {
  FOOD: Utensils,
  SHOPPING: ShoppingCart,
  INCOME: Briefcase,
  UTILITIES: Zap,
  HOUSING: Home,
  CREDIT: CreditCard,
  TRANSPORTATION: Car,
  TRAVEL: Plane,
  GIFTS: Gift,
  ENTERTAINMENT: Coffee,
};

export function CategorySelect({
  onSelect,
  currentCategoryId,
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const renderCategoryWithIcon = (category: Category) => {
    // Get icon based on category name (case-insensitive)
    const IconComponent =
      categoryIcons[category.name.toUpperCase()] || ShoppingCart;
    return (
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4" />
        {/* Capitalize first letter of each word */}
        <span>
          {category.name
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </span>
      </div>
    );
  };

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  const currentCategory = categories.find((c) => c.id === currentCategoryId);

  return (
    <Select defaultValue={currentCategoryId} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>
          {currentCategory ? (
            renderCategoryWithIcon(currentCategory)
          ) : (
            <span className="text-muted-foreground">Select category</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
            className="capitalize"
          >
            {renderCategoryWithIcon(category)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
