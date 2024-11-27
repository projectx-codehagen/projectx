import { type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/db";

export interface CategoryRule {
  id: string;
  name: string;
  icon: string;
  patterns: string[];
  type?: "CREDIT" | "DEBIT";
}

export interface SuggestedCategory {
  categoryId: string;
  confidence: number; // 0-1 score of how confident we are
  autoApprove: boolean; // Whether this should be auto-approved
}

export const CATEGORIZATION_RULES: CategoryRule[] = [
  {
    id: "income",
    name: "INCOME",
    icon: "income",
    patterns: ["salary", "deposit", "payroll"],
    type: "CREDIT",
  },
  {
    id: "food",
    name: "FOOD",
    icon: "food",
    patterns: ["grocery", "restaurant", "food", "cafe", "coffee"],
  },
  {
    id: "utilities",
    name: "UTILITIES",
    icon: "utilities",
    patterns: ["utility", "electric", "water", "gas", "bill"],
  },
  // Add more categories...
];

export function suggestCategory(
  description: string,
  amount: number,
  type: "CREDIT" | "DEBIT"
): SuggestedCategory | null {
  const lowerDesc = description.toLowerCase();

  // First check type-specific rules
  if (type === "CREDIT") {
    const incomeRule = CATEGORIZATION_RULES.find((r) => r.type === "CREDIT");
    if (incomeRule) {
      return {
        categoryId: incomeRule.id,
        confidence: 0.9,
        autoApprove: true,
      };
    }
  }

  // Then check description patterns
  for (const rule of CATEGORIZATION_RULES) {
    if (rule.type && rule.type !== type) continue;

    const matchingPatterns = rule.patterns.filter((pattern) =>
      lowerDesc.includes(pattern.toLowerCase())
    );

    if (matchingPatterns.length > 0) {
      return {
        categoryId: rule.id,
        confidence: matchingPatterns.length / rule.patterns.length,
        autoApprove: matchingPatterns.length > 1, // Auto-approve if multiple patterns match
      };
    }
  }

  return null;
}

// First, ensure we create the categories in the database
export async function ensureDefaultCategories(userId: string) {
  const defaultCategories = await Promise.all(
    CATEGORIZATION_RULES.map(async (rule) => {
      const category = await prisma.category.upsert({
        where: {
          name_userId: {
            name: rule.name,
            userId,
          },
        },
        update: {},
        create: {
          name: rule.name,
          icon: rule.icon,
          userId,
        },
      });
      return { ...category, ruleId: rule.id };
    })
  );

  return defaultCategories;
}
