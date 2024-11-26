import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Wallet2, LineChart, Briefcase } from "lucide-react";

interface PositionsTableProps {
  data?: {
    id: string;
    type: string;
    amount: number;
    shares: number | null;
    price: number;
    date: Date;
    description: string;
    investment: {
      id: string;
      name: string;
      type: string;
      amount: number;
      shares: number | null;
      purchasePrice: number | null;
      currentPrice: number | null;
    };
  }[];
}

const iconMap = {
  STOCKS: BarChart2,
  CRYPTO: Wallet2,
  ETF: LineChart,
  OTHER: Briefcase,
};

export function PositionsTable({ data = [] }: PositionsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((position) => {
            const Icon =
              iconMap[position.investment.type as keyof typeof iconMap] ||
              Briefcase;
            const showShares = position.shares !== null;

            return (
              <div
                key={position.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {position.investment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {showShares &&
                        `${position.shares} shares @ $${position.price}`}
                      {!showShares && position.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${position.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(position.date).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
