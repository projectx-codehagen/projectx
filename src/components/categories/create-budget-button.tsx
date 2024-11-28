"use client";

import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createDefaultBudget } from "@/actions/budgets/create-default-budget";

export function CreateBudgetButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      const result = await createDefaultBudget();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(
        "Default budget created! You can now edit individual categories."
      );
    } catch (error) {
      toast.error("Failed to create default budget");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Default Budget
        </>
      )}
    </Button>
  );
}
