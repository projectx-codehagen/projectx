import {
  Home,
  Utensils,
  Car,
  Zap,
  Coffee,
  Heart,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  keywords: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "housing",
    name: "Housing",
    icon: Home,
    color: "hsl(var(--chart-1))",
    keywords: ["rent", "mortgage", "house", "apartment", "housing"],
  },
  {
    id: "food",
    name: "Food",
    icon: Utensils,
    color: "hsl(var(--chart-2))",
    keywords: ["grocery", "restaurant", "food", "meal", "dining"],
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    color: "hsl(var(--chart-3))",
    keywords: [
      "gas",
      "fuel",
      "car",
      "bus",
      "train",
      "transport",
      "uber",
      "lyft",
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: Zap,
    color: "hsl(var(--chart-4))",
    keywords: ["electric", "water", "gas", "internet", "phone", "utility"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Coffee,
    color: "hsl(var(--chart-5))",
    keywords: ["movie", "game", "entertainment", "fun", "hobby"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    color: "hsl(var(--chart-6))",
    keywords: ["doctor", "medical", "health", "medicine", "pharmacy"],
  },
  {
    id: "other",
    name: "Other",
    icon: HelpCircle,
    color: "hsl(var(--chart-7))",
    keywords: [],
  },
];

export function findCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function suggestCategoryForTransaction(description: string): string {
  const lowerDesc = description.toLowerCase();

  for (const category of CATEGORIES) {
    if (category.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category.id;
    }
  }

  return "other";
}
