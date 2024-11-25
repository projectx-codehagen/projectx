import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase } from "lucide-react";

interface AssetTableProps {
  data?: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    asset: {
      name: string;
      type: string;
    };
  }[];
}

const iconMap = {
  REAL_ESTATE: Home,
  VEHICLE: Car,
  PRECIOUS_METALS: Coins,
  OTHER: Briefcase,
};

export function AssetTable({ data = [] }: AssetTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((transaction) => {
            const Icon =
              iconMap[transaction.asset.type as keyof typeof iconMap] ||
              Briefcase;
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString([], {
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
