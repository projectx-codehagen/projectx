import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const tips = [
  "Set up automatic transfers to your savings account",
  "Review and cut unnecessary subscriptions",
  "Use the 50/30/20 budgeting rule",
  "Look for ways to reduce your largest expenses",
  "Save your tax refunds and work bonuses",
];

export function SavingsTips() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Savings Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
