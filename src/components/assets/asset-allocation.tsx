import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase } from "lucide-react";

const categories = [
  {
    name: "Real Estate",
    icon: Home,
    percentage: 60,
    value: 750000,
    progress: "w-[60%]",
  },
  {
    name: "Vehicles",
    icon: Car,
    percentage: 6.8,
    value: 85000,
    progress: "w-[6.8%]",
  },
  {
    name: "Gold",
    icon: Coins,
    percentage: 4,
    value: 50000,
    progress: "w-[4%]",
  },
  {
    name: "Other",
    icon: Briefcase,
    percentage: 29.2,
    value: 365000,
    progress: "w-[29.2%]",
  },
];

export function AssetAllocation() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
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
                className={`h-full rounded-full bg-[hsl(var(--chart-2))] ${category.progress}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
