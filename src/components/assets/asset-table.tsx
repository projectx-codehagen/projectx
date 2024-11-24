import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Car, Coins, Briefcase, Laptop, Plane } from "lucide-react";

const assets = [
  {
    icon: Home,
    name: "Primary Residence",
    value: 500000,
    change: "+2.1%",
  },
  {
    icon: Home,
    name: "Vacation Home",
    value: 250000,
    change: "+1.8%",
  },
  {
    icon: Car,
    name: "Tesla Model S",
    value: 75000,
    change: "-1.2%",
  },
  {
    icon: Car,
    name: "Vintage Car",
    value: 10000,
    change: "+5.4%",
  },
  {
    icon: Coins,
    name: "Gold Bullion",
    value: 50000,
    change: "+0.8%",
  },
  {
    icon: Laptop,
    name: "Tech Gadgets",
    value: 15000,
    change: "-2.3%",
  },
  {
    icon: Plane,
    name: "Private Jet Share",
    value: 250000,
    change: "+1.5%",
  },
  {
    icon: Briefcase,
    name: "Art Collection",
    value: 100000,
    change: "+3.2%",
  },
];

export function AssetTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Asset Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assets.map((asset) => (
            <div key={asset.name} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-muted p-2">
                  <asset.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {asset.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${asset.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm ${
                  asset.change.startsWith("+")
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {asset.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
