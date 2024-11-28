import {
  CATEGORIES,
  suggestCategoryForTransaction,
} from "@/lib/config/categories";

export function suggestCategory(
  description: string,
  amount: number,
  type: "CREDIT" | "DEBIT"
) {
  const suggestedId = suggestCategoryForTransaction(description, type);
  const category = CATEGORIES.find((cat) => cat.id === suggestedId);

  if (!category) {
    return {
      categoryId: "other",
      confidence: 0.3,
    };
  }

  // Higher confidence for income transactions
  if (type === "CREDIT" && category.type === "CREDIT") {
    return {
      categoryId: category.id,
      confidence: 0.9,
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
