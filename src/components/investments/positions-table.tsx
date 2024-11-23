import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Apple,
  ShoppingCart,
  ComputerIcon as Windows,
  Car,
  ShoppingBag,
  Chrome,
} from "lucide-react";

const positions = [
  {
    icon: Apple,
    name: "Apple Inc.",
    value: 150.0,
    change: "+2.4%",
  },
  {
    icon: ShoppingCart,
    name: "Walmart Inc",
    value: 150.0,
    change: "+1.2%",
  },
  {
    icon: Windows,
    name: "Microsoft Corp.",
    value: 250.0,
    change: "+3.8%",
  },
  {
    icon: Car,
    name: "Tesla Inc.",
    value: 300.0,
    change: "-2.1%",
  },
  {
    icon: ShoppingBag,
    name: "Amazon.Com Inc.",
    value: 320.0,
    change: "+4.2%",
  },
  {
    icon: Chrome,
    name: "Alphabet Inc.",
    value: 280.0,
    change: "+1.8%",
  },
];

export function PositionsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {positions.map((position) => (
            <div
              key={position.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-2">
                  <position.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {position.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${position.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm ${
                  position.change.startsWith("+")
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {position.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
