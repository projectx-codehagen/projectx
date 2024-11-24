import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, CreditCard, Car, GraduationCap } from "lucide-react";

const categories = [
  {
    name: "Mortgage",
    icon: Home,
    percentage: 77.8,
    value: 350000,
    progress: "w-[77.8%]",
  },
  {
    name: "Credit Cards",
    icon: CreditCard,
    percentage: 1.1,
    value: 5000,
    progress: "w-[1.1%]",
  },
  {
    name: "Car Loan",
    icon: Car,
    percentage: 5.6,
    value: 25000,
    progress: "w-[5.6%]",
  },
  {
    name: "Student Loans",
    icon: GraduationCap,
    percentage: 15.5,
    value: 70000,
    progress: "w-[15.5%]",
  },
];

export function LiabilityAllocation() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Liability Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{category.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {category.percentage.toFixed(1)}%
                </span>
                <span>${category.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-destructive/50 ${category.progress}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
