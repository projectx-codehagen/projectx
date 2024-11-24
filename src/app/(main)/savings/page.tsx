import { SavingsGoals } from "@/components/savings/savings-goals";
import { SavingsOverview } from "@/components/savings/savings-overview";
import { SavingsRecommendations } from "@/components/savings/savings-recommendations";
import { SavingsTips } from "@/components/savings/savings-tips";

export default function SavingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your savings</h2>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <SavingsOverview />
        <SavingsGoals />
        <SavingsTips />
      </div>

      <div className="grid gap-4">
        <SavingsRecommendations />
      </div>
    </div>
  );
}
