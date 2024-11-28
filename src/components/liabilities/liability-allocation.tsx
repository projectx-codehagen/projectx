import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, CreditCard, Car, GraduationCap } from "lucide-react";

interface LiabilityAllocationProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

const iconMap = {
  MORTGAGE: Home,
  CREDIT_CARD: CreditCard,
  CAR_LOAN: Car,
  STUDENT_LOAN: GraduationCap,
};

export function LiabilityAllocation({ data = [] }: LiabilityAllocationProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Liability Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((category) => {
          const Icon = iconMap[category.originalName as keyof typeof iconMap];
          return (
            <div key={category.originalName} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
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
                  className="h-full rounded-full bg-destructive/50"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
