import {
  Home,
  Utensils,
  Car,
  Zap,
  Coffee,
  Heart,
  HelpCircle,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  keywords: string[];
  type?: "CREDIT" | "DEBIT";
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "income",
    name: "Income",
    icon: Briefcase,
    color: "hsl(var(--chart-0))",
    keywords: ["salary", "deposit", "payroll", "income"],
    type: "CREDIT",
  },
  {
    id: "housing",
    name: "Housing",
    icon: Home,
    color: "hsl(var(--chart-1))",
    keywords: ["rent", "mortgage", "house", "apartment", "housing"],
    type: "DEBIT",
  },
  {
    id: "food",
    name: "Food",
    icon: Utensils,
    color: "hsl(var(--chart-2))",
    keywords: ["grocery", "restaurant", "food", "meal", "dining"],
    type: "DEBIT",
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
    type: "DEBIT",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: Zap,
    color: "hsl(var(--chart-4))",
    keywords: ["electric", "water", "gas", "internet", "phone", "utility"],
    type: "DEBIT",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Coffee,
    color: "hsl(var(--chart-5))",
    keywords: ["movie", "game", "entertainment", "fun", "hobby"],
    type: "DEBIT",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    color: "hsl(var(--chart-6))",
    keywords: ["doctor", "medical", "health", "medicine", "pharmacy"],
    type: "DEBIT",
  },
  {
    id: "other",
    name: "Other",
    icon: HelpCircle,
    color: "hsl(var(--chart-7))",
    keywords: [],
    type: "DEBIT",
  },
];

export function findCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function suggestCategoryForTransaction(
  description: string,
  type: "CREDIT" | "DEBIT"
): string {
  if (type === "CREDIT") {
    const incomeCategory = CATEGORIES.find((cat) => cat.type === "CREDIT");
    if (incomeCategory) {
      return incomeCategory.id;
    }
  }

  const lowerDesc = description.toLowerCase();

  for (const category of CATEGORIES) {
    if (category.type === "CREDIT" && type === "DEBIT") continue;

    if (category.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category.id;
    }
  }

  return "other";
}
