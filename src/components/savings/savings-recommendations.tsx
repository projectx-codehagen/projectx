import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Target, Briefcase } from "lucide-react";

const recommendations = [
  {
    icon: ArrowUpCircle,
    title: "Increase Your Savings",
    description:
      "Based on your income, we recommend increasing your monthly savings by $300.",
    action: "Adjust Budget",
    variant: "default" as const,
  },
  {
    icon: Target,
    title: "Set a Specific Goal",
    description:
      "Setting a clear savings goal can help you stay motivated. How about saving for a down payment?",
    action: "Set Goal",
    variant: "outline" as const,
  },
  {
    icon: Briefcase,
    title: "Diversify Your Savings",
    description:
      "Consider allocating some of your savings to low-risk investment options for potentially higher returns.",
    action: "Explore Options",
    variant: "outline" as const,
  },
];

export function SavingsRecommendations() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((rec) => (
            <div key={rec.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <rec.icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{rec.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <Button size="sm" variant={rec.variant}>
                {rec.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
