import { getCurrentUser } from "@/actions/user/get-current-user";
import { getSavingsOverview } from "@/actions/savings/get-savings-overview";
import { SavingsGoals } from "@/components/savings/savings-goals";
import { SavingsOverview } from "@/components/savings/savings-overview";
import { SavingsRecommendations } from "@/components/savings/savings-recommendations";
import { SavingsActions } from "@/components/savings/savings-actions";
import { redirect } from "next/navigation";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { PiggyBank } from "lucide-react";
import { AddSavingsGoal } from "@/components/savings/add-savings-goal";

export default async function SavingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { success, data, error } = await getSavingsOverview();

  if (!success || !data || data.savingsGoals.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Your savings</h2>
        </div>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon icon={PiggyBank} />
          <EmptyPlaceholder.Title>No savings goals yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Create your first savings goal to start tracking your progress.
          </EmptyPlaceholder.Description>
          <AddSavingsGoal />
        </EmptyPlaceholder>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Your savings (under development)
        </h2>
        <AddSavingsGoal />
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <SavingsOverview data={data} />
        <SavingsGoals data={data.savingsGoals} />
        <SavingsRecommendations data={data.recommendations} />
      </div>

      <div className="grid gap-4">
        <SavingsActions goals={data.savingsGoals} />
      </div>
    </div>
  );
}
