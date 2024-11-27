import {
  CATEGORIES,
  suggestCategoryForTransaction,
} from "@/lib/config/categories";

export function suggestCategory(
  description: string,
  amount: number,
  type: "CREDIT" | "DEBIT"
) {
  // If it's a credit, it might be income
  if (type === "CREDIT") {
    return {
      categoryId: "income",
      confidence: 0.8,
    };
  }

  const suggestedId = suggestCategoryForTransaction(description);
  const category = CATEGORIES.find((cat) => cat.id === suggestedId);

  if (!category) {
    return {
      categoryId: "other",
      confidence: 0.3,
    };
  }

  // Calculate confidence based on keyword match strength
  const confidence = category.keywords.some((k) =>
    description.toLowerCase().includes(k.toLowerCase())
  )
    ? 0.8
    : 0.5;

  return {
    categoryId: category.id,
    confidence,
  };
}

export const CATEGORIZATION_RULES = CATEGORIES;
