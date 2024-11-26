import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Wallet2, LineChart, Briefcase } from "lucide-react";

interface PortfolioAllocationProps {
  data?: {
    name: string;
    originalName: string;
    value: number;
    percentage: number;
    progress: string;
  }[];
}

const iconMap = {
  STOCKS: BarChart2,
  CRYPTO: Wallet2,
  ETF: LineChart,
  OTHER: Briefcase,
};

export function PortfolioAllocation({ data = [] }: PortfolioAllocationProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Portfolio Spread</CardTitle>
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
                  className="h-full rounded-full bg-[hsl(var(--chart-2))]"
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
